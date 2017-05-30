<template>
	<div id="app">
		<p class="text-center app-title">Easy Todo</p>
		<el-row :gutter="20">
			<el-col :span="21">
				<el-input placeholder="请输入内容"
						  v-model="content"
						  class="top-input"
						  @keyup.enter.native="doConfirm(content)"
						  :class="selectClass"
						  icon="edit"
						  :on-icon-click="showTextArea">
					<el-select v-model="selectClass" slot="prepend">
						<el-option label="记录" value="a_info"></el-option>
						<el-option label="重要" value="b_important"></el-option>
						<el-option label="紧急" value="c_urgency"></el-option>
					</el-select>
				</el-input>
			</el-col>
			<el-col :span="3">
				<el-button type="primary" @click="doConfirm(content)" style="width: 100%">确 定</el-button>
			</el-col>
		</el-row>

		<el-row type="flex" justify="space-between" :gutter="20" style="margin-top: 20px">
			<el-col :span="8" v-for="(v, k) in store">
				<todo-item :type="k" :data="v"></todo-item>
			</el-col>
		</el-row>

		<div class="text-right text" style="margin-top: 15px">
			本插件已开源至 <a href="http://github.com/lavyun/Easy-todo" target="_blank" style="color: #20a0ff;outline: none">lavyun / Easy-todo</a>
		</div>

		<el-dialog title="输入待办事项" :visible.sync="dialogVisible" size="large">
			<el-input
					type="textarea"
					:rows="5"
					placeholder="请输入内容"
					v-model="textarea">
			</el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="doConfirm(textarea)">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import TodoItem from './components/TodoItem'
	import storage from './storage'

	export default {
		name: 'app',
		components: {
			TodoItem
		},
		data() {
			return {
				selectClass: 'a_info',
				content: '',
				textarea: '',
				dialogVisible: false,
				store: {
					a_info: {
						name: '记录',
						list: []
					},
					b_important: {
						name: '重要',
						list: []
					},
					c_urgency: {
						name: '紧急',
						list: []
					}
				}
			}
		},
		created(){
			this.init()
		},
		methods: {
			init(){
				storage.get('easyTodoStorage').then(rs => {
					this.$set(this.$data, 'store', rs || {
							a_info: {
								name: '记录',
								list: []
							},
							b_important: {
								name: '重要',
								list: []
							},
							c_urgency: {
								name: '紧急',
								list: []
							}
						})
				});
			},
			doConfirm(content){
				if (content.trim() === '') {
					return this.$message({
						type: 'warning',
						message: '不能为空哦'
					})
				}
				this.store[this.selectClass].list.splice(0, 0, {
					content: content,
					showBody: false,
					remind: ''
				});

				this.content = '';
				this.textarea = '';
				this.dialogVisible = false;
				this.setStore();
			},
			setStore(){
				var store = this.store;
				for (let k in store) {
					var list = store[k].list;
					for (let v of list) {
						v.showBody = false
						if(v.remind) {
							v.remind = v.remind.toString();
						}
					}
				}

				storage.set({
					easyTodoStorage: store
				})
			},
			showTextArea(){
				this.textarea = this.content;
				this.dialogVisible = true
			}
		}
	}
</script>
