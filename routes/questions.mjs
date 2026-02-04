import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { createQuestionValidation } from "../middlewares/createQuestions.validation.mjs";
import { readQuestionFromIdValidation } from "../middlewares/readQuestionFromId.validate.mjs";
import { updateQuestionFromIdValidation } from "../middlewares/updateQuestionFromId.validate.mjs";
import { deleteQuestionFromIdValidation } from "../middlewares/deleteQuestionFromId.validate.mjs";
import { searchQuestionFromIdValidation } from "../middlewares/searchQuestions.validation.mjs";
import { createAnswerValidation } from "../middlewares/createAnswer.validation.mjs";
import { readAllAnswerFromIdValidation } from "../middlewares/readAllAnswer.validation.mjs";
import { deleteAnswerForQuestion } from "../middlewares/deleteAnswerForQuestion.validate.mjs";

const questionRouter = Router()

// ค้นหาคำถามจากหัวข้อ หรือหมวดหมู่ได้
questionRouter.get("/search",[searchQuestionFromIdValidation],async (req, res) => {
    try {
      const titleParam = req.query.title ? `%${req.query.title}%` : null;
      const categoryParam = req.query.category
        ? `%${req.query.category}%`
        : null;
      const result = await connectionPool.query(
        `
      SELECT * FROM questions 
      WHERE (title ILIKE $1 OR $1 IS NULL)  
      AND
      (category ILIKE $2 OR $2 IS NULL)  
      `,
        [titleParam, categoryParam]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Question not found." });
      }
      return res
        .status(201)
        .json({ message: "Success to Search questions.", data: result.rows });
    } catch (error) {
      return res.status(500).json({ message: "Unable to fetch a question." });
    }
  }
);

// สร้างคำถาม
questionRouter.post("/", [createQuestionValidation], async (req, res) => {
  const newQuestion = { ...req.body };

  try {
    const result = await connectionPool.query(
      `INSERT INTO questions (title,description,category) VALUES ($1,$2,$3) RETURNING *`,
      [newQuestion.title, newQuestion.description, newQuestion.category]
    );
    return res
      .status(201)
      .json({ message: "Success to Create questions.", data: result.rows });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error to Create questions.", error: error.message });
  }
});

// ดูคำถามทั้งหมด
questionRouter.get("/", async (req, res) => {
  try {
    const result = await connectionPool.query(`SELECT * FROM questions`);
    return res
      .status(201)
      .json({ message: "Success to fetch questions.", data: result.rows });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch questions." });
  }
});

// ดูคำถามแต่ละอันได้ ด้วย Id ของคำถาม
questionRouter.get("/:questionId",[readQuestionFromIdValidation],async (req, res) => {
    const questionIdFromClient = req.params.questionId;

    try {
      const result = await connectionPool.query(
        `SELECT * FROM questions WHERE id = $1`,
        [questionIdFromClient]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Question not found." });
      }

      return res
        .status(201)
        .json({ message: "Success to fetch questions.", data: result.rows });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Unable to fetch questions.", error: error.message });
    }
  }
);

//แก้ไขหัวข้อ หรือคำอธิบายของคำถาม ด้วย Id ของคำถาม
questionRouter.put("/:questionId",[updateQuestionFromIdValidation],async (req, res) => {
    const questionIdFromClient = req.params.questionId;
    const updateQuestion = { ...req.body };

    try {
      const result = await connectionPool.query(
        `
      UPDATE questions SET 
      title = $2 ,
      description = $3 ,
      category = $4 
      WHERE id = $1
      RETURNING * `,
        [
          questionIdFromClient,
          updateQuestion.title,
          updateQuestion.description,
          updateQuestion.category,
        ]
      );

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Question updated successfully." });
      }

      return res
        .status(201)
        .json({ message: "Success to update questions.", data: result.rows });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Unable to update questions.", error: error.message });
    }
  }
);

// ลบคำถาม ด้วย Id ของคำถาม
questionRouter.delete("/:questionId",[deleteQuestionFromIdValidation],async (req, res) => {
    const questionIdFromClient = req.params.questionId;

    try {
      const result = await connectionPool.query(
        `
      DELETE FROM questions WHERE id = $1 RETURNING * `,
        [questionIdFromClient]
      );

      await connectionPool.query(`DELETE FROM answers WHERE question_id = $1`,[questionIdFromClient])

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Question not found." });
      }
      return res.status(201).json({
        message: "Question post has been deleted successfully. ",
        data: result.rows,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Unable to delete question.", error: error.message });
    }
  }
);

// สร้างคำตอบของคำถามนั้นๆ ด้วย Id ของคำถาม
questionRouter.post("/:questionId/answers",[createAnswerValidation],async (req, res) => {
    const questionIdFromClient = req.params.questionId;
    const newAnswer = { ...req.body };
    try {

      const checkQuestion = await connectionPool.query(
        `SELECT id FROM questions WHERE id = $1`,
        [questionIdFromClient]
      );

      if (checkQuestion.rows.length === 0) {
        return res.status(404).json({ message: "Question not found." });
      }

      const result = await connectionPool.query(
        `
        INSERT INTO answers (question_id, content) 
        VALUES ($1, $2) 
        RETURNING *;
        `,
        [questionIdFromClient, newAnswer.content]
      );

      return res
        .status(201)
        .json({ message: "Answer created successfully.", data: result.rows });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Unable to create answers.", error: error.message });
    }
  }
);

// ดูคำตอบของคำถามแต่ละอัน ด้วย Id ของคำถาม
questionRouter.get("/:questionId/answers", [readAllAnswerFromIdValidation],async (req, res) => {
  const questionIdFromClient = req.params.questionId;
  
  try {
    const checkQuestion = await connectionPool.query(
      `SELECT id FROM questions WHERE id = $1`,
      [questionIdFromClient]
    );

    if (checkQuestion.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    const result = await connectionPool.query(`SELECT * FROM answers WHERE question_id = $1`,[
      questionIdFromClient
    ]);
    return res
      .status(201)
      .json({ message: "Success to fetch answers.", data: result.rows });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch answers." });
  }
});

// ลบคำตอบจากคำถาม ด้วย Id ของคำถาม
questionRouter.delete("/:questionId/answers", [deleteAnswerForQuestion],async (req, res) => {
  const questionIdFromClient = req.params.questionId;
  
  try {
    const checkQuestion = await connectionPool.query(
      `SELECT id FROM questions WHERE id = $1`,
      [questionIdFromClient]
    );

    if (checkQuestion.rows.length === 0) {
      return res.status(404).json({ message: "Question not found." });
    }

    const result = await connectionPool.query(`DELETE FROM answers WHERE question_id = $1  RETURNING *`,[
      questionIdFromClient
    ]);
    return res
      .status(201)
      .json({message: "All answers for the question have been deleted successfully.", data: result.rows });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete answers." });
  }
});

export default questionRouter