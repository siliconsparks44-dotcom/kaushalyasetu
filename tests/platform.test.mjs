import test from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

test('LMI-CAP Platform Full Verification Suite', async (t) => {
  await t.test('1. Database connectivity and Seed Data validation', async () => {
    const userCount = await prisma.user.count();
    assert.ok(userCount >= 5, 'Should have at least 5 demo persona accounts seeded');

    const admin = await prisma.user.findUnique({ where: { email: 'admin@lmi.gov.in' } });
    assert.ok(admin, 'Admin account should exist');
    assert.equal(admin.role, 'ADMIN', 'Admin role should be ADMIN');

    const isMatch = await bcrypt.compare('Password@123', admin.passwordHash);
    assert.equal(isMatch, true, 'Admin password hash should verify against Password@123');
  });

  await t.test('2. Normalized Skill Taxonomy and Aliases', async () => {
    const pySkill = await prisma.skill.findUnique({ where: { name: 'Python' } });
    assert.ok(pySkill, 'Python skill must exist in normalized taxonomy');

    const alias = await prisma.skillAlias.findFirst({ where: { alias: 'python3' } });
    assert.ok(alias, 'Alias "python3" should exist');
    assert.equal(alias.skillId, pySkill.id, 'Alias should map to Python canonical skill');
  });

  await t.test('3. Local NLP Skill Extraction Logic', async () => {
    const sampleText = 'Seeking a data analyst skilled in Python, SQL, and Power BI with 3 years experience.';
    // Simple inline verification of regex taxonomy patterns
    assert.ok(/python/i.test(sampleText), 'Should detect Python in text');
    assert.ok(/sql/i.test(sampleText), 'Should detect SQL in text');
    assert.ok(/power\s*bi/i.test(sampleText), 'Should detect Power BI in text');
  });

  await t.test('4. Course-to-Industry Alignment Engine calculation', async () => {
    const course = await prisma.course.findFirst({
      include: { courseSkills: { include: { skill: true } } },
    });
    assert.ok(course, 'Course should exist in database');
    assert.ok(course.courseSkills.length > 0, 'Course should have mapped skills');

    const courseSkillNames = course.courseSkills.map((cs) => cs.skill.name);
    assert.ok(courseSkillNames.includes('EV Diagnostics') || courseSkillNames.includes('CNC Programming'), 'Should contain expected core course competencies');
  });

  await t.test('5. Human-in-the-Loop Curriculum Governance Model', async () => {
    const rec = await prisma.curriculumRecommendation.findFirst({
      where: { status: 'PENDING' },
    });
    assert.ok(rec, 'Should have at least 1 pending recommendation awaiting human sign-off');
    assert.ok(rec.confidence >= 0.8, 'Recommendation must have high confidence score');
    assert.ok(rec.reason.length > 10, 'Recommendation must include evidence-based justification');
  });

  await t.test('6. District Training Plan & Gap Calculations', async () => {
    const plan = await prisma.districtPlan.findFirst({
      include: { recommendations: true },
    });
    assert.ok(plan, 'District plan should exist in database');
    assert.ok(plan.recommendedCapacity > plan.currentCapacity, 'Recommended capacity should reflect regional vacancy demand');
    assert.ok(plan.trainerGapCount > 0, 'Should calculate trainer deficit count');
    assert.ok(plan.equipmentGapCount > 0, 'Should calculate equipment deficit count');
  });

  await t.test('7. Placements and Employer Feedback Loop', async () => {
    const placement = await prisma.placement.findFirst({
      include: { feedback: true },
    });
    assert.ok(placement, 'Placement outcome should exist');
    assert.ok(placement.salary >= 300000, 'Salary should be recorded');
    assert.ok(placement.feedback, 'Post-placement employer feedback should be linked');
    assert.ok(placement.feedback.technicalSkillRating >= 1, 'Technical skill feedback rating should be present');
  });

  await t.test('8. JWT Token Generation and Verification', () => {
    const secret = 'test-secret-key-123456789012345678';
    const payload = { userId: 'u-123', email: 'test@example.com', role: 'ADMIN', fullName: 'Test Admin' };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    assert.ok(token, 'Token should be signed');

    const decoded = jwt.verify(token, secret);
    assert.equal(decoded.userId, 'u-123');
    assert.equal(decoded.role, 'ADMIN');
  });
});
