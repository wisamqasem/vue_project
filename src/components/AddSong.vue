<template>
  <div class="add-song">
    <button v-if="!showForm" @click="showForm = true">Add Songs</button>
    <form v-if="showForm" @submit.prevent="handleSubmit">
      <h4>Add a New Song</h4>
      <input type="text" placeholder="Song title" required v-model="title">
      <input type="text" placeholder="Artist" required v-model="artist">

       upload Song
      <label>Upload Song</label>
      <input type="file" @change="handleChange" >
      <div class="error">{{ fileError }}</div>
      <button v-if="!isPending">Add</button>
      <button v-else disabled>Uploading...</button>
      <!-- <button>Add</button> -->
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import useStorage from '@/composables/useStorage'
import useDocument from '../composables/useDocument'

export default {
  props: ['playlist'],
  setup(props) {
    const { filePath, url, uploadSong } = useStorage()
    const file = ref(null)
    const title = ref('')
    const artist = ref('')
    const showForm = ref(false)
    const fileError = ref(null)
    const isPending = ref(false)
    const { updateDoc } = useDocument('playlists', props.playlist.id)

    const handleSubmit = async () => {
        isPending.value = true
        
     await uploadSong(file.value,props.playlist.title)
      const newSong = {
        title: title.value,
        artist: artist.value,
        songUrl: url.value,
        filePath: filePath.value, // so we can delete it later 
        id: Math.floor(Math.random() * 1000000)
      }
      
      const res = await updateDoc({
        songs: [...props.playlist.songs, newSong]
      })
      isPending.value = false
      title.value = ''
      artist.value = ''
    }
// allowed file types
    const types = ['audio/mpeg']
     const handleChange = (e) => {
      let selected = e.target.files[0]
      console.log("selected : ",selected)

      if (selected && types.includes(selected.type)) {
        file.value = selected
        fileError.value = null
      } else {
        file.value = null
        fileError.value = 'Please select an image file (png or jpg)'
      }
    }

    return { title, artist,fileError, showForm, handleSubmit,handleChange, isPending }
  }
}
</script>

<style scoped>
  .add-song {
    text-align: center;
    margin-top: 40px;
  }
  form {
    max-width: 100%;
    text-align: left;
  }
</style>