(function() {
	var show = true;  // 是否显示通知

	var isToday = function(time) {   // 提醒是否是今天
		time = new Date(time);
		var tYear = time.getFullYear();
		var tMonth = time.getMonth();
		var tDate = time.getDate();

		var now = new Date();
		var cYear = now.getFullYear();
		var cMonth = now.getMonth();
		var cDate = now.getDate();

		return tYear === cYear && tMonth === cMonth && tDate === cDate
			? true
			: false;
	};

	var hasRemind = function() {  // 今天有没有提醒
		show = false;
		var todayRecords = [];   // 所有的今日提醒
		var todoList = {};   // 所有的待办事项
		var notifications = [];  // 所有的通知列表
		chrome.storage.sync.get('easyTodoStorage', function(rs) {
			var count = 1;
			rs = rs.easyTodoStorage;
			todoList = rs;
			for (var key in rs) {
				var list = rs[key].list;
				for (var i = 0, len = list.length; i < len; i++) {
					var remind = list[i].remind;
					if (remind && !list[i].read) {
						try {
							if (isToday(remind)) {
								todayRecords.push({
									key: key,
									index: i,
								});
								notifications.push({
									title: String(count++),
									message: list[i].content,
								});
							}
						} catch (__) {}
					}
				}
			}

			if (notifications.length > 0) {
				chrome.notifications.create('', {
					iconUrl: 'images/icon48.png',
					type: 'list',
					title: '您今日有' + notifications.length + '条待办事项',
					message: '来自Easy Todo 的提醒',
					items: notifications,
					buttons: [
						{
							title: '查看事项',
						}, {
							title: '标记已读',
						}],
				});

				chrome.notifications.onButtonClicked.addListener(
					function(notificationId, buttonIndex) {
						var setNotificationsRead = function() {
							for (var i = 0; i < todayRecords.length; i++) {
								var record = todayRecords[i];
								todoList[record.key].list[record.index].read = true;
							}

							chrome.storage.sync.set({
								easyTodoStorage: todoList
							})
						};

						setNotificationsRead();

						if(buttonIndex === 0) {
							window.open('chrome-extension://dojpalgaibbbcejjloifcljcahhljchh/index.html');
						}

						chrome.notifications.clear(notificationId)
					});

			}
		});
	};

	chrome.runtime.onMessage.addListener(function(request) {
		if (request.text === 'showNotifications') {
			if (show) {
				hasRemind();
			}
		}
	});
})();




