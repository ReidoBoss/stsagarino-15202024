<template>
  <div class="qwe">
    <h1 class="heading">
      <span v-if="isUpdating">Updating</span>
      Kanbans
    </h1>
    <form @submit.prevent="submitKanban">
      <input
        type="text"
        placeholder="Work name"
        v-model="name"
        maxlength="250"
      >
      <br>
      <textarea
        class="work-description"
        type="text"
        placeholder="Work description"
        v-model="description"
        maxlength="1000"
      >
      </textarea>
      <br>
      <button type="submit">Submit</button>
    </form>
  </div>

  <InputKanbanVue
  />
  <p>{{errorMessage}}</p>
  <div class="kanbans-container">
    <KanbanVue
      type="TODO"
      :kanbans="todoKanban"
      @start-drag="dragKanban"
      @at-drop="onDrop"
      @delete-kanban="deleteKanban"
    />
    <KanbanVue
      type="IN_PROGRESS"
      :kanbans="inProgressKanban"
      @start-drag="dragKanban"
      @at-drop="onDrop"
      @delete-kanban="deleteKanban"

    />
    <KanbanVue
      type="DONE"
      :kanbans="doneKanban"
      @start-drag="dragKanban"
      @at-drop="onDrop"
      @delete-kanban="deleteKanban"
    />
  </div>

</template>

<script lang="ts" setup>
  import '../assets/main.css'
  import { ref,onMounted,computed } from 'vue';
  import { ZodError } from 'zod';
  import axios from 'axios'
  import { KanbanSchema, type Kanban, type Status} from '../model/domain/Kanban'
  import InputKanbanVue from '../components/InputKanban.vue';

  import KanbanVue from '../components/Kanban.vue';

  const errorMessage = ref<string>('')
  type isUpdating = {
    isUpdating:boolean
  }
  const kanbans = ref<Array<Kanban & Partial<isUpdating>>>([])
  const name = ref('')
  const description = ref('')

  var id = 1
  function submitKanban(){
      const kanbanData:Partial<Kanban> = {
        id:id,
        name: name.value,
        description:description.value,
        status: 'TODO'
      }
      id++;
      kanbans.value.push(kanbanData as Kanban)
      reset()

  }
  function reset(){
    name.value = ''
    description.value =''
  }


  const todoKanban = computed(()=>{
    return kanbans.value.filter((kanban:Kanban)=> kanban.status === 'TODO')
  })

  const inProgressKanban = computed(()=>{
    return kanbans.value
    .filter((kanban:Kanban)=> kanban.status === 'IN_PROGRESS')
  })

  const doneKanban = computed(()=>{
    return kanbans.value.filter((kanban:Kanban)=> kanban.status === 'DONE')
  })

  function onDrop(event:DragEvent,type:Status){
    const kanbanId = event.dataTransfer?.getData('kanbanID')
    updateKanbanStatus(kanbanId!,type)
  }

  function dragKanban(event:DragEvent,kanban:Kanban){
    event.dataTransfer!.dropEffect = 'move'
    event.dataTransfer!.effectAllowed = 'move'
    event.dataTransfer!.setData('kanbanID',kanban.id!)
  }

  const isUpdating = ref<boolean>(false)
  function goUpdate(kanban:Kanban){
    isUpdating.value = !isUpdating.value
    name.value = kanban.name
    description.value = kanban.description
  }

  function updateKanban(kanban:Kanban){
    const updatedKanban =
      kanbans.value
      .find((_kanban)=>_kanban.id === kanban.id)
    updatedKanban!.name = kanban.name
    updatedKanban!.description = kanban.description
  }

  function updateKanbanStatus(id:number,type:Status){
    const kanban = kanbans.value.find((kanban:Kanban) => kanban.id === parseInt(id))
    kanban!.status = type
  }

  function deleteKanban(id:string){
    const filteredKanban = kanbans.value
      .filter((kanban: Kanban) => kanban.id !== id);
    kanbans.value = filteredKanban
  }


</script>

<style>
  .qwe{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 40px;
  }
  .qwe input{
    font-size: 40px;
  }
  .qwe button{
    font-size: 40px;
  }
  .work-description{
    width: 413px;
    height: 175px;
  }
</style>

