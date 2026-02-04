export const createQuestionValidation = (req,res,next) => {
 const newQuestion = {...req.body}


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