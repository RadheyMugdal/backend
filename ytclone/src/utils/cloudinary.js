import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadonCloudinary=async (localFilePath)=>{
    try {
        if(!localFilePath){
            return null;
        }

        //upload the file on cloudinary
       const responce=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })

        //file has been uploaded successfully
        console.log("File is uploaded on cloudinary",responce.url);
        fs.unlinkSync(localFilePath)
        return responce;
    } catch (error) {
        fs.unlinkSync(localFilePath)   //remove the locaaly saved temporary file as the upload operation got failed
        // console.log('Error in uploading image to Cloudinary', error);
        return null;
        
    }
}


export { uploadonCloudinary };


