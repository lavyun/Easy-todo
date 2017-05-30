<template>
	<div class="todo-item" :class="type">
		<div class="el-card box-card">
			<div class="el-card__header">
				<div class="clearfix card-header">
					<el-row>
						<el-col :span="4">{{data.name}}</el-col>
						<el-col :span="20" class="text-right">
							共有待办 {{data.list.length}} 条，提醒 {{remindLength}} 条
						</el-col>
					</el-row>
				</div>
			</div>
			<div class="el-card__body scrollbar">
				<div class="text list-item" v-for="(item,index) in data.list">
					<el-row>
						<el-col :span="item.remind ? 14 : 22">
							<p class="text-ellipsis" style="cursor: pointer"
							   @click="item.showBody = !item.showBody; dateValueIndex = index">
								<span :class="`el-icon-caret-${item.showBody ? 'bottom' : 'right'}`"></span>
								{{item.content}}
                            </p>
						</el-col>
						<el-col v-show="item.remind" :span="8" class="text-center">
                              <span class="list-item-remind" :class="type + '-back'">
                                <img src="../assets/icon-remind.png" style="height: 12px;margin-top: 4px">
                                {{item.remind | date2str}}
                                <i style="cursor: pointer;" @click="item.remind = ''">×</i>
                              </span>
						</el-col>
						<el-col :span="2" class="text-right">
                            <span class="el-icon-circle-cross" style="cursor: pointer"
								  @click="deleteList(index)"></span>
						</el-col>
					</el-row>

					<div class="list-item-body" v-show="item.showBody">
						{{item.content}}

						<div style="margin-top: 5px">
							设置提醒：

							<el-date-picker
									v-model="item.remind"
									type="date"
									size="mini"
									placeholder="选择日期"
									@change="dateChange(index)">
							</el-date-picker>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: ['type', 'data'],
		data(){
			return {
				pickerOptions0: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7;
					}
				}
			}
		},
		filters: {
			date2str(value){
				var time = new Date(value);
				var month = time.getMonth() + 1;
				var date = time.getDate();
				if (month < 10) month = '0' + month;
				if (date < 10) date = '0' + date;
				return `${month}-${date}`
			}
		},
		computed: {
			remindLength(){
				var reminds = this.data.list.filter(function(value) {
					return value.remind;
				});
				return reminds.length
			}
		},
		created(){
			this.$nextTick(() => {
				this.setDatePickerDefault()
			})
		},
		methods: {
			setDatePickerDefault(){
				for (let v of this.data.list) {
					this.$set(v, 'remind', v.remind || '')
				}
			},
			deleteList(index){
				this.$delete(this.data.list, index);
				this.setStore()
			},
			dateChange(index){
				this.data.list[index].read = false;
				this.setStore();
			},
			setStore(){
				const app = this.$root.$children[0];
				app.setStore()
			}
		}
	}
</script>

<style lang="less">
	.text {
		font-size: 14px;
	}

	.list-item {
		margin-top: 15px;
		&:first-of-type {
			margin-top: 0;
		}
	}

	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}

	.clearfix:after {
		clear: both
	}

	.box-card {
		width: 100%;
	}

	.list-item-body {
		padding: 8px 0 0 18px;
		word-wrap: break-word;
	}

</style>
