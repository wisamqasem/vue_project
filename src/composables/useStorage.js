import { projectStorage } from '../firebase/config'
import { ref } from "vue"
import getUser from "./getUser"

const { user } = getUser()

const useStorage = () => {
  const error = ref(null)
  const url = ref(null)
  const filePath = ref(null)

  const uploadImage = async (file,playlistTitle) => {
    filePath.value = `covers/${user.value.uid}/${playlistTitle}/${file.name}`
    filePath.playlist=`covers/${user.value.uid}/${playlistTitle}/`
    const storageRef = projectStorage.ref(filePath.value)

    try {
      const res = await storageRef.put(file)
      url.value = await res.ref.getDownloadURL()
    } catch (err) {
      console.log(err.message)
      error.value = err
    }
  }
//new.........................................................
  const uploadSong = async (file,playlistTitle) => {
    filePath.value = `covers/${user.value.uid}/${playlistTitle}/${file.name}`
    const storageRef = projectStorage.ref(filePath.value)

    try {
      const res = await storageRef.put(file)
      url.value = await res.ref.getDownloadURL()
    } catch (err) {
      console.log(err.message)
      error.value = err
    }
  }
//............................................................
//                       THIS FUNCTION DELETE A PLAYLIST FOLDER
  const deleteImage = async (path) => {
    const storageRef = projectStorage.ref(path);
    
  
    try {
        ////// THIS FUNCTION TO DELETE A FOLDER WITH EVERY THING IN IT , IN FIREBASE STORGE.
        await storageRef.listAll().then((listResults) => {
        const promises = listResults.items.map((item) => {
          return item.delete();
        });
        Promise.all(promises);
      });
     // await storageRef.delete()
    } catch (err) {
      console.log(err.message)
      error.value = err
    }
  }
  const deleteSong = async (path) => {
    const storageRef = projectStorage.ref(path);

    try {
      await storageRef.delete()
    } catch (err) {
      console.log(err.message)
      error.value = err
    }
  }
  

  return { uploadImage, uploadSong, deleteImage,deleteSong, url, filePath, error }
}


export default useStorage;