import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
  filename: (req,file,cb) =>{
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = [".jpeg", ".jpg", ".png", ".webp"].includes(ext) ? ext : "";
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${safeExt}`);
  }
})

//fileFilter : jpeg,png,webp only
const fileFilter = (req,file,cb)=>{
  const allowedTypes = /jpeg|jpg|png|webp/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimeType = allowedTypes.test(file.mimeType)

  if(extname && mimeType){
    cb(null,true) //error and success
  }else{
    cb(new Error("Only images of type jpeg,jpg,png and webp are allowed!"))
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits:{fileSize:5*1024*1024} //Max File Size: 5 MB
})