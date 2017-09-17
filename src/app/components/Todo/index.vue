<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h5>{{numberOfCompletedTasks}} pending task(s)</h5>
        <!--<p translate>{{"test"}}</p>-->
        <!--<p translate>{{"test.abc"}}</p>-->
        <form id="todo-form" @submit.prevent="add">
          <div class="form-group">
            <input id="new-todo" v-model="newContent" class="form-control"
                   placeholder="What you need to do ?"/>
          </div>
        </form>
      </div>
    </div>

    <div class="row" id="todo-list">
      <div class="todo-item col-md-12" v-for="todo in sortedTasks" :class="{completed: todo.completed}">
        <input type="checkbox" :checked="todo.completed" @change="toggleCompleted({todo})"/>
        <span class="todo-content">{{todo.content}}</span>
        <a class="btn-remove-todo float-right" @click="remove({todo})">X</a>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <div id="toolbar">
          <a id="btn-remove-all"
             @click="removeAll"
             class="btn btn-sm btn-secondary float-right"
             v-show="todoList.length > 0">
            Clear all
          </a>
        </div>
      </div>
    </div>
    <div>{{$t('test')}}</div>
    <div>{{$t('nested.abc')}}</div>
    <div>
      <!-- selector -->
      <select v-model="$i18n.locale">
        <option value="en">EN</option>
        <option value="de-DE">DE</option>
      </select>
    </div>
  </div>
</template>
<script>
  import {mapState, mapMutations} from 'vuex'
  import todoMutationConstants from '../../store/constants/mutations'

  const {ADD, REMOVE, REMOVE_ALL, TOGGLE} = todoMutationConstants

  export default {
    name: 'TodoComponent',
    data () {
      return {
        newContent: ''
      }
    },
    computed: {
      completedTasks () {
        return this.todoList.filter(task => task.completed === false)
      },
      numberOfCompletedTasks () {
        return this.completedTasks.length
      },
      sortedTasks () {
        return JSON.parse(JSON.stringify(this.todoList)).sort((a, b) => (a - b))
      },
      ... mapState({
        todoList: state => state.todos
      })
    },
    methods: {
      add () {
        const todo = {
          content: this.newContent,
          completed: false,
          createdAt: new Date()
        }
        this.$store.commit({
          type: ADD,
          todo
        })
        this.newContent = ''
      },
      ...mapMutations({
        remove: REMOVE,
        removeAll: REMOVE_ALL,
        toggleCompleted: TOGGLE
      })
    }
  }
</script>
<style lang="scss" src="./style.scss" scoped></style>
