import { type Request, type Response } from "express";

import { pool } from "../database/db.js";
import { broadcast } from "../websocket/index.js";

export const getMessages = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT
                m.id,
                m.content,
                COUNT(l.id)::int as likes
            FROM messages m
            LEFT JOIN likes l
                ON m.id = l.message_id
            GROUP BY m.id
            ORDER BY m.id DESC
        `);

        res.json(result.rows || []);
    } catch (error) {
        console.error(error);
        res.status(500).json([]);
    }
};

export const createMessage = async (req: Request, res: Response) => {
    const { content } = req.body;

    if (!content || content.trim() === "") {
        return res.status(400).json({
            error: "El contenido del mensaje no puede estar vacío",
        });
    }

    if (content.length < 1) {
        return res.status(400).json({
            error: "El mensaje debe tener al menos 1 carácter",
        });
    }

    const result = await pool.query(
        `
      INSERT INTO messages(content)
      VALUES($1)
      RETURNING *
    `,
        [content],
    );

    res.status(201).json(result.rows[0]);

    broadcast({
        type: "NEW_MESSAGE",
        payload: result.rows[0],
    });
};

export const addLike = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({
            error: "ID inválido",
        });
    }
    try {
        await pool.query(
            `
          INSERT INTO likes(message_id)
          VALUES($1)
        `,
            [id],
        );
    
        res.json({
            message: "Like agregado",
        });
    
        broadcast({
            type: "NEW_LIKE",
            payload: {
                messageId: id,
            },
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al agregar like" });
    }

};
