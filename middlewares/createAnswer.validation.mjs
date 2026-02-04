export const createAnswerValidation = (req,res,next) => {
 const newAnswer = {...req.body}


if (!newAnswer.content) {
    return res.status(400).json({message: "Invalid request data. : Content is required."})
}

if (newAnswer.content && newAnswer.content.length > 300) {
    return res.status(400).json({
        message: "Invalid request data. Content must not exceed 300 characters."
    });
}

next()
}