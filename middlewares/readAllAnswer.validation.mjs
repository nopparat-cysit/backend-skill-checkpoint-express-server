export const readAllAnswerFromIdValidation = (req,res,next) => {
    const questionIdFromClient = req.params.questionId

   if (questionIdFromClient && isNaN(questionIdFromClient)) {
        return res.status(400).json({ 
        message: "Invalid ID format. Question ID must be a number." 
    });
   }

   next()
   }