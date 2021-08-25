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

      <button>Add</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import useDocument from '../composables/useDocument'

export default {
  props: ['playlist'],
  setup(props) {
    const title = ref('')
    const artist = ref('')
    const showForm = ref(false)
    const fileError = ref(null)
    const { updateDoc } = useDocument('playlists', props.playlist.id)

    const handleSubmit = async () => {
        
      const newSong = {
        title: title.value,
        artist: artist.value,
        //song: 
        id: Math.floor(Math.random() * 1000000)
      }
      
      const res = await updateDoc({
        songs: [...props.playlist.songs, newSong]
      })
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

    return { title, artist,fileError, showForm, handleSubmit,handleChange }
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