export const searchQuestionFromIdValidation = (req,res,next) => {
   
    const { title, category } = req.query;

    if (!title && !category) {
      return res.status(400).json({ 
        message: "Invalid search parameters."
      });
    }
   

   next()
   }