export const updateQuestionFromIdValidation = (req,res,next) => {
    const questionIdFromClient = req.params.questionId
    const newQuestion = {...req.body}
   
   if (questionIdFromClient && isNaN(questionIdFromClient)) {
        return res.status(400).json({ 
        message: "Invalid ID format. Question ID must be a number." 
    });
   }

   if (!newQuestion.title) {
       return res.status(400).json({message: "Invalid request data. : Title is required."})
   }
   
   if (!newQuestion.description) {
       return res.status(400).json({message: "Invalid request data. : Description is required."})
   }
   
   if (!newQuestion.category) {
       return res.status(400).json({message: "Invalid request data. : Category is required."})
   }
   

   next()
   }