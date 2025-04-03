import {createClient} from '@supabase/supabase-js'; 

const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-supabase-key';


const supabase = createClient(supabaseUrl, supabaseKey);



async function uploadFile(file: File) {
    // Create a reference to the storage bucket and the file path
    const filePath = `uploads/${file.name}`;
  
    // Upload the file to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('your-bucket-name')  // Replace with your bucket name
      .upload(filePath, file);
  
    if (error) {
      console.error('Error uploading file:', error);
    } else {
      console.log('File uploaded successfully:', data);
    }
  }
  