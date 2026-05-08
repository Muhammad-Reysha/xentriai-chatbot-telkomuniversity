// This file is prepared for your friend's Django API later.
// Currently it uses a dummy implementation.

export interface UploadDatasetPayload {
  file: File;
  judul: string;
  kategori: string;
}

export const uploadDatasetUser = async (payload: UploadDatasetPayload): Promise<{ success: boolean; message: string }> => {
  // Simulate an API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Dummy upload payload:', payload);
      // Here you will replace this with the actual fetch/axios call to the Django backend
      // Example:
      // const formData = new FormData();
      // formData.append('file', payload.file);
      // formData.append('judul', payload.judul);
      // formData.append('kategori', payload.kategori);
      // const response = await fetch('YOUR_DJANGO_API_URL/upload', { method: 'POST', body: formData });
      // return response.json();
      
      resolve({ success: true, message: 'Dataset berhasil diunggah (Dummy)!' });
    }, 1500);
  });
};
