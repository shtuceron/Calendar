/*
 * Плагин Calendar используется для выбора даты (формат даты: YYYY-MM-dd hh-mm-ss).
 * @class - calendar-field
 * @attr - calendarOffsetX
 * @attr - calendarOffsetY
*/
(function($) {
	function Core() {
		var $this = this;
		
		this.calendar = null;
		
		this.yearsContent = null;
		this.monthsContent = null;
		this.daysContent = null;
		this.hmsContent = null;

		this.textField = null;
		this.textFields = null;
		
		this.daysNames = [ 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс' ],
		this.monthsNames = [ 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь' ];
		
		this.today = new Date();

		this.todayYear = $this.today.getFullYear();
		this.todayMonth = $this.today.getMonth();
		this.todayDayIndex = $this.today.getDate();
		
		this.selectedYear = null;
		this.selectedMonth = null;
		this.selectedDayIndex = null;
		this.selectedHours = null;
		this.selectedMinutes = null;
		this.selectedSeconds = null;

		this.displayedYear = null;
		this.displayedMonth = null;
		
		this.init = function() {
			var html = '<div class="calendar"> \
							<table class="wrap"> \
								<tr><td class="top" colspan="3"><div></div></td></tr> \
								<tr> \
									<td class="left"><div></div></td> \
									<td class="center"> \
										<div> \
											<div class="header"><input class="prev" type="button" /><div class="current"><ul><li class="month"></li><li class="hms"></li><li class="year"></li></ul></div><input class="next" type="button" /></div> \
											<div class="months-content">' + $this.monthsTable() + '</div> \
											<div class="hms-content"><table><tbody><tr><td class="up-hours"><input type="button" /></td><td></td><td class="up-minutes"><input type="button" /></td><td></td><td class="up-seconds"><input type="button" /></td></tr><tr class="digits"><td class="hours"></td><td>:</td><td class="minutes"></td><td>:</td><td class="seconds"></td></tr><tr><td class="dn-hours"><input type="button" /></td><td></td><td class="dn-minutes"><input type="button" /></td><td></td><td class="dn-seconds"><input type="button" /></td></tr></tbody></table></div> \
											<div class="years-content">' + $this.yearsTable() + '</div> \
											<div class="days-content">' + $this.daysTable() + '</div> \
										</div> \
									</td> \
									<td class="right"><div></div></td> \
								</tr> \
								<tr><td class="bottom" colspan="3"><div></div></td></tr> \
							</table> \
						</div>';
			
			$('body').append(html);
			
			$this.calendar = $('div.calendar');
			
			$this.yearsContent = $this.calendar.find('div.years-content');
			$this.monthsContent = $this.calendar.find('div.months-content');
			$this.daysContent = $this.calendar.find('div.days-content');
			$this.hmsContent = $this.calendar.find('div.hms-content');

			$this.textFields = $('input.calendar-field');
			$this.textFields.val($this.getCurrentTime());
		};
		
		this.monthsTable = function() {
			var html = '';
			
			for (var i = 0; i < 3; i++) {
				html += '<tr>';
				
				for (var j = 0; j < 4; j++)
					html += '<td class="month" order="' + (4 * i + j) + '">' + $this.monthsNames[4 * i + j] + '</td>';
				
				html += '</tr>';
			}
			
			return '<table><tbody>' + html + '</tbody></table>';
		};
		
		this.yearsTable = function() {
			var html = '';
			
			for (var i = 0; i < 4; i++) {
				html += '<tr>';
				
				for (var j = 0; j < 4; j++)
					html += '<td class="year"></td>';
				
				html += '</tr>';
			}
			
			return '<table><tbody>' + html + '</tbody></table>';
		};
		
		this.daysTable = function() {
			var html = '<table><thead><tr>';
			
			for (var i = 0, maxI = $this.daysNames.length; i < maxI; i++)
				html += '<td>' + $this.daysNames[i] + '</td>';
			
			html += '</tr></thead><tbody>';
			
			for (var i = 0; i < 6; i++) {
				html += '<tr>';
				
				for (var j = 0; j < 7; j++)
					html += '<td></td>';
				
				html += '</tr>';
			}
			
			return html + '</tbody></table>';
		};

		this.getCurrentTime = function() {
			var date 	= new Date(),
				year    = date.getFullYear(),
				month   = date.getMonth() + 1,
				day     = date.getDate(),
				hours   = date.getHours(),
				minutes = date.getMinutes(),
				seconds = date.getSeconds();
				
			month   = (month/10 < 1.0) ? '0' + month : month;
			day     = (day/10 < 1.0) ? '0' + day : day;
			hours   = (hours/10 < 1.0) ? '0' + hours : hours;
			minutes = (minutes/10 < 1.0) ? '0' + minutes : minutes;
			seconds = (seconds/10 < 1.0) ? '0' + seconds : seconds;
				
			return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
		};
		
		this.parseDate = function(date) {
			var parsedDate, ymd, hms;

			if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(date))
				return false;

			parsedDate = date.split(' '),
			ymd = parsedDate[0].split('-'),
			hms = parsedDate[1].split(':');

			if (ymd[0] < 0 || (ymd[1] < 1 || ymd[1] > 12) || (ymd[2] < 1 || ymd[2] > 31) || (hms[0] < 0 || hms[0] > 24) || (hms[1] < 0 || hms[1] > 59) || (hms[2] < 0 || hms[2] > 59))
				return false;

			$this.selectedYear = $this.displayedYear = ymd[0];
			$this.selectedMonth = $this.displayedMonth = ymd[1] - 1;
			$this.selectedDayIndex = ymd[2];
			
			$this.selectedHours = hms[0];
			$this.selectedMinutes = hms[1];
			$this.selectedSeconds = hms[2];
			
			$this.calculateDays($this.selectedYear, $this.selectedMonth);

			return true;
		};
		
		this.calculateDays = function(year, month) {
			var cntDaysInMonth,	// Количество дней в месяце.
				fstDayInMonth,	// Первый день месяца.
				lstDayInMonth;	// Последний день месяцы.

			var headerItems = $this.calendar.find('div.header > div.current > ul');

			headerItems.find('li.month').text($this.monthsNames[month]);
			headerItems.find('li.year').text(year);

			$this.daysContent.find('tr td').removeClass('day todayBGColorCell selectedBGColorCell');

			cntDaysInMonth = 32 - new Date(year, month, 32).getDate();
			
			fstDayInMonth = new Date(year, month, 1).getDay();
			fstDayInMonth = (fstDayInMonth == 0) ? 7 : fstDayInMonth;
			
			lstDayInMonth = new Date(year, month, cntDaysInMonth).getDay();
			lstDayInMonth = (lstDayInMonth == 0) ? 7 : lstDayInMonth;
			
			var dayIndex = 1;
			
			$this.daysContent.find('tbody tr').each(function(rowIndex) {
				$(this).children().each(function(cellIndex) {
					$(this).parent().css('display', 'table-row');
					
					if (fstDayInMonth <= (7 * rowIndex + (cellIndex + 1))) {
						if (dayIndex >= 1 && dayIndex <= cntDaysInMonth) {
							if ($this.todayYear == year && $this.todayMonth == month && $this.todayDayIndex == dayIndex)
								$(this).css('color', '#fff').addClass('day todayBGColorCell').text(dayIndex);
							else if ($this.selectedYear == year && $this.selectedMonth == month && $this.selectedDayIndex == dayIndex)
								$(this).css('color', '#000').addClass('day selectedBGColorCell').text(dayIndex);
							else
								$(this).css('color', '#000').addClass('day').text(dayIndex);

							dayIndex++;
						}
						else {
							$(this).text('');
							
							if (rowIndex == 5 && cellIndex == 0) {
								$(this).parent().hide();
								
								return;
							}
						}
					}
					else {
						$(this).text('');
					}
				});
			});
		};
		
		this.calculateYears = function(year) {
			var dataRows = $this.yearsContent.find('tr');

			dataRows.find('td.selectedBGColorCell').removeClass('selectedBGColorCell');

			dataRows.each(function(rowIndex) {
				$(this).children().each(function(cellIndex) {
					if (year == $this.displayedYear)
						$(this).addClass('selectedBGColorCell');
					
					$(this).text(year++);
				});
			});
		};
		
		this.hideCalendar = function() {
			$this.calendar.hide();
			$this.textFields.removeClass('calendar-field-visible');
		};
		
		this.showCalendar = function(textField) {
			$this.textFields.removeClass('calendar-field-visible');
			
			$this.textField = textField;
			$this.textField.addClass('calendar-field-visible');
			
			$this.calendar.show();
			$this.observe();
		};
		
		this.observe = function() {
			var offsetX = 0,
				offsetY = 0,
				calendarOffsetX = 0,
				calendarOffsetY = 0;
			
			if ($this.textField !== null) {
				if ($this.textField.attr('calendarOffsetX') !== undefined)
					calendarOffsetX = +$this.textField.attr('calendarOffsetX');
			
				if ($this.textField.attr('calendarOffsetY') !== undefined)
					calendarOffsetY = +$this.textField.attr('calendarOffsetY');
				
				if ($this.textField.hasClass('calendar-field-top')) {
					offsetX = ($this.textField.width() - $('div.calendar').width())/2;
				
					$this.calendar.find('td.top > div').hide();
					$this.calendar.find('td.bottom > div').show();
					
					$this.calendar.css({'top': ($this.textField.offset().top + $this.textField.height() + calendarOffsetY - 15),
										'left': ($this.textField.offset().left + calendarOffsetX + offsetX)});
				}
				
				if ($this.textField.hasClass('calendar-field-bottom')) {
					offsetX = ($this.textField.width() - $('div.calendar').width())/2;
				
					$this.calendar.find('td.top > div').show();
					$this.calendar.find('td.bottom > div').hide();
					
					$this.calendar.css({'top': ($this.textField.offset().top + $this.textField.height() + $this.calendar.find('table.wrap').height() + calendarOffsetY + 15),
										'left': ($this.textField.offset().left + calendarOffsetX + offsetX)});
				}
			}
		};
		
		this.hideNavArrows = function() {
			$this.calendar.find('div.header > input.prev, div.header > input.next').hide();
		};
		
		this.showNavArrows = function() {
			$this.calendar.find('div.header > input.prev, div.header > input.next').show();
		};

		this.hideAllContent = function() {
			$this.calendar.find('td.center > div > div:gt(0)').hide();
		};

		this.showYearsContent = function(year) {
			$this.hideAllContent();
			$this.yearsContent.show();

			this.calculateYears(year);

			$this.showNavArrows();
			$this.observe();
		};

		this.showMonthsContent = function(name) {
			var dataRows = $this.monthsContent.find('tr');
			
			$this.hideAllContent();
			$this.monthsContent.show();
			
			dataRows.find('td.selectedBGColorCell').removeClass('selectedBGColorCell');
			
			dataRows.each(function(rowIndex) {
				var dataCell = $(this).children();
				
				dataCell.each(function(cellIndex) {
					if ($(this).text() == name)
						$(this).addClass('selectedBGColorCell');
				});
			});

			$this.hideNavArrows();
			$this.observe();
		};

		this.showDaysContent = function() {
			$this.hideAllContent();
			$this.daysContent.show();
			
			$this.showNavArrows();
			$this.observe();
		};

		this.showHmsContent = function() {
			$this.hideAllContent();
			$this.hmsContent.show();

			$this.hmsContent.find('td.hours').text($this.selectedHours);
			$this.hmsContent.find('td.minutes').text($this.selectedMinutes);
			$this.hmsContent.find('td.seconds').text($this.selectedSeconds);

			$this.hideNavArrows();
			$this.observe();	
		};
		
		this.setDateTime = function() {
			if ($this.calendar.is(':visible')) {
				$('input.calendar-field-visible').val(
					$this.selectedYear + 
					'-' + 
					(((+$this.selectedMonth + 1) < 10) ? ('0' + (+$this.selectedMonth + 1)) : (+$this.selectedMonth + 1)) + 
					'-' + 
					((+$this.selectedDayIndex < 10) ? ('0' + (+$this.selectedDayIndex)) : $this.selectedDayIndex) + 
					' ' + 
					$this.selectedHours + 
					':' + 
					$this.selectedMinutes + 
					':' + 
					$this.selectedSeconds
				);
			}
		};
	};
	
	$.fn.calendar = function() {
		var core = new Core();
		
		core.init();
		
		$(window).resize(function() {
			core.observe();
		});
		
		$('html').click(function() {
			core.hideCalendar();
		});
		
		$('html').on('click', 'input.calendar-field', function(e) {
			if ($(this).hasClass('calendar-field-visible')) {
				core.hideCalendar();
			}
			else {
				if (!core.parseDate($(this).val())) {
					alert('Неправильный формат даты.');
					return;
				}

				core.showDaysContent();
				core.showCalendar($(this));
			}
			
			e.stopPropagation();
		});
		
		core.calendar.click(function(e) {
			e.stopPropagation();
		});
		
		core.calendar.find('div.header input.prev').click(function() {
			if (core.daysContent.is(':visible')) {
				if ((core.displayedMonth - 1) < 0) {
					core.displayedYear--;
					
					core.displayedMonth = core.monthsNames.length - 1;
				}
				else {
					core.displayedMonth--;
				}
				
				core.calculateDays(core.displayedYear, core.displayedMonth);
			}
			
			if (core.yearsContent.is(':visible'))
				core.calculateYears(+core.yearsContent.find('tr:first td:first').text() - 16);
				
			core.observe();
		});

		core.calendar.find('div.header input.next').click(function() {
			if (core.daysContent.is(':visible')) {
				if ((core.displayedMonth + 1) > (core.monthsNames.length - 1)) {
					core.displayedYear++;
					
					core.displayedMonth = 0;
				}
				else {
					core.displayedMonth++;
				}
				
				core.calculateDays(core.displayedYear, core.displayedMonth);
			}
			
			if (core.yearsContent.is(':visible'))
				core.calculateYears(+core.yearsContent.find('tr:last td:last').text() + 1);
				
			core.observe();
		});

		core.calendar.find('div.header li.month').click(function() {
			if (core.monthsContent.is(':hidden'))
				core.showMonthsContent($(this).text());
			else
				core.showDaysContent();
		});
		
		core.monthsContent.find('td').click(function() {
			core.calendar.find('div.header li.month').text($(this).text());
			
			core.displayedMonth = core.selectedMonth = $(this).attr('order');
			
			core.calculateDays(core.selectedYear, core.selectedMonth);

			core.showDaysContent();
			core.setDateTime();
		});
		
		core.calendar.find('div.header li.hms').click(function() {
			if (core.calendar.find('div.hms-content').is(':hidden'))
				core.showHmsContent();
			else
				core.showDaysContent();
		});
		
		core.hmsContent.find('td.up-hours').click(function() {
			core.selectedHours++;
			
			if (core.selectedHours > 24)
				core.selectedHours = 00;
				
			if (core.selectedHours < 10)
				core.selectedHours = '0' + core.selectedHours;
			
			core.hmsContent.find('td.hours').text(core.selectedHours);
			
			core.setDateTime();
		});
		
		core.hmsContent.find('td.dn-hours').click(function() {
			core.selectedHours--;
			
			if (core.selectedHours < 0)
				core.selectedHours = 24;
				
			if (core.selectedHours < 10)
				core.selectedHours = '0' + core.selectedHours;
			
			core.hmsContent.find('td.hours').text(core.selectedHours);
			
			core.setDateTime();
		});
		
		core.hmsContent.find('td.up-minutes').click(function() {
			core.selectedMinutes++;
			
			if (core.selectedMinutes > 59)
				core.selectedMinutes = 00;
				
			if (core.selectedMinutes < 10)
				core.selectedMinutes = '0' + core.selectedMinutes;
			
			core.hmsContent.find('td.minutes').text(core.selectedMinutes);
			
			core.setDateTime();
		});
		
		core.hmsContent.find('td.dn-minutes').click(function() {
			core.selectedMinutes--;
			
			if (core.selectedMinutes < 0)
				core.selectedMinutes = 59;
			
			if (core.selectedMinutes < 10)
				core.selectedMinutes = '0' + core.selectedMinutes;
			
			core.hmsContent.find('td.minutes').text(core.selectedMinutes);
			
			core.setDateTime();
		});
		
		core.hmsContent.find('td.up-seconds').click(function() {
			core.selectedSeconds++;
			
			if (core.selectedSeconds > 59)
				core.selectedSeconds = 00;
				
			if (core.selectedSeconds < 10)
				core.selectedSeconds = '0' + core.selectedSeconds;
			
			core.hmsContent.find('td.seconds').text(core.selectedSeconds);
			
			core.setDateTime();
		});
		
		core.hmsContent.find('td.dn-seconds').click(function() {
			core.selectedSeconds--;
			
			if (core.selectedSeconds < 0)
				core.selectedSeconds = 59;
				
			if (core.selectedSeconds < 10)
				core.selectedSeconds = '0' + core.selectedSeconds;
			
			core.hmsContent.find('td.seconds').text(core.selectedSeconds);
			
			core.setDateTime();
		});
		
		core.calendar.find('div.header li.year').click(function() {
			if (core.yearsContent.is(':hidden'))
				core.showYearsContent(core.selectedYear - 15);
			else
				core.showDaysContent();
		});
		
		core.yearsContent.find('td').click(function() {
			$(this).closest('table').find('td').removeClass('selectedBGColorCell');
			core.calendar.find('div.header li.year').text($(this).text());
			
			core.displayedYear = core.selectedYear = $(this).text();
			
			core.calculateDays(core.selectedYear, core.selectedMonth);
			core.showDaysContent();
			
			core.setDateTime();
		});
		
		core.daysContent.find('tr:gt(0) td').on('click', function() {
			var displayedDayIndex = $(this).text();

			if (displayedDayIndex.length > 0) {
				core.selectedYear = core.displayedYear;
				core.selectedMonth = core.displayedMonth;
				core.selectedDayIndex = displayedDayIndex;
				
				core.daysContent.find('td.selectedBGColorCell').removeClass('selectedBGColorCell');
				
				$(this).addClass('selectedBGColorCell');
				
				core.setDateTime();
			}
		});
	};
})(jQuery);