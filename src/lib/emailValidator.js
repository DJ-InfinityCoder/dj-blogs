import axios from "axios";

export const isDisposableEmail = async (email) => {
  try {
    const response = await axios.get(`https://www.disify.com/api/email/${email}`);
    return response.data.disposable; 
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
};
