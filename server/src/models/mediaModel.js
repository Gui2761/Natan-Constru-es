import { q, scrub } from '../lib/prisma.js';

export const mediaModel = {
  async create({ data }) {
    const { filename, entityType, entityId } = data;
    const [res] = await q(
      'INSERT INTO Media (filename, entityType, entityId) VALUES (?, ?, ?)',
      [filename, entityType, entityId],
      true
    );
    return this.findUnique({ where: { id: res.insertId } });
  },

  async findUnique({ where }) {
    return q('SELECT * FROM Media WHERE id = ? LIMIT 1', [where.id]).then(r => r[0] || null);
  },

  async findMany({ where }) {
    const keys = Object.keys(where);
    const clause = keys.length ? 'WHERE ' + keys.map(k => `\`${k}\` = ?`).join(' AND ') : '';
    return q(`SELECT * FROM Media ${clause} ORDER BY id ASC`, Object.values(where));
  },

  async delete({ where }) {
    await q('DELETE FROM Media WHERE id = ?', [where.id]);
    return { success: true };
  },

  async deleteByEntity(entityType, entityId) {
    await q('DELETE FROM Media WHERE entityType = ? AND entityId = ?', [entityType, entityId]);
    return { success: true };
  }
};
