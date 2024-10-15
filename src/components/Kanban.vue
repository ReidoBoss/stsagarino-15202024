<template>
  <div
    class="kanbans"
    @dragenter.prevent
    @dragover.prevent
    @drop="$emit('atDrop',$event,type)"
  >
    <h1
      class="kanban-type"
    >
      {{type}}
    </h1>
    <p>{{errorMessage}}</p>
    <div
      class="kanban"
      draggable="true"
      v-for="(kanban,index) in kanbans"
      :key = "kanban.id+kanban.name"
      @dragstart="$emit('startDrag', $event, kanban)"
    >
      <h1>
        <span v-if="!kanban.isUpdating">
          {{kanban.name}}
        </span>
        <span v-else>
          <input
            type="text"
            :value="kanban.name"
            @input="($event:any)=> kanban.name = $event.target.value"
            placeholder="Name"
          >
        </span>
      </h1>
      <p>
        <span v-if="!kanban.isUpdating">
          {{kanban.description}}
        </span>
        <span v-else>
          <input
            type="text"
            :value="kanban.description"
            @input="($event:any)=> kanban.description = $event.target.value"
            placeholder="Description"
          >
        </span>
      </p>
      <div v-if="!kanban.isUpdating">
        <button @click="initiateUpdate(kanban.id!)">Update</button>
        <button @click="$emit('deleteKanban',kanban.id)">Delete</button>
      </div>
      <div v-else>
          <button @click="updateKanban(kanban)">Submit</button>
          <button @click="initiateUpdate(kanban.id!)">Cancel</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import '../assets/kanban.css'
  import { ref } from 'vue';
  import axios from 'axios'
  import { type Kanban, type Status } from '../model/domain/Kanban'

  type isUpdating = { isUpdating:boolean }

  type KanbanWithUpdate = Kanban & Partial<isUpdating>
  interface Props{
    type:Status
    kanbans:Array<KanbanWithUpdate>
  }

  defineEmits(['startDrag','atDrop','deleteKanban']);
  const prop = defineProps<Props>()
  const errorMessage = ref<string>('')

  const url = import.meta.env.VITE_KANBAN_URL

  function initiateUpdate(id:string) {
    const kanbans = prop.kanbans
    const kanbanUpdateIndex = kanbans.find((kanban)=>kanban.id === id)
    if(!kanbanUpdateIndex?.isUpdating ){
      kanbanUpdateIndex!.isUpdating = true
    }else{
      kanbanUpdateIndex.isUpdating = false
    }
  }


  async function updateKanban(kanban:Kanban){
    try{
      const response = await axios.put(url+'/kanban',kanban)
      if(response.status !== 200){
        throw new Error("Error: response is not ok")
      }
      const data = response.data
      const statusCode = data.code

      if (statusCode === 7) resetUpdatedKanban(kanban)
      else if (statusCode === 6) throw new Error('Non Updated!')
      else if (statusCode === 5) throw new Error('Invalid ID')
      else if (statusCode === 3) throw new Error('Invalid Status Type')
    }catch(error){
      console.log(error)
    }
  }
  function resetUpdatedKanban(kanban:KanbanWithUpdate){
    const kanbans = prop.kanbans
    const kanbanUpdated = kanbans.find((_kanban)=>_kanban.id === kanban.id)!
    kanbanUpdated.name = kanban.name
    kanbanUpdated.description = kanban.description
    kanbanUpdated.isUpdating = false
  }

  function temporaryErrorGiver(message:string){
    errorMessage.value = message
    setTimeout(()=> errorMessage.value = '')
  }

</script>

