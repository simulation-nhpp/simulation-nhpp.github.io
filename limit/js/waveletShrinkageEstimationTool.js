function module_tab()
{

}

function index_tab() 
{
	$.cookie('WSEtype',0)
	$.cookie('fileStatus',1)
	$.cookie('radioStatus',0)

	$("#Parameter_c_div").hide()

	layui.use('element', function(){
		var element = layui.element;
		element.on('tab(WSE-tab)', function(data){
			//console.log(data.index); //得到当前Tab的所在下标
			$.cookie('WSEtype', data.index);
		});
	  //…
	});

	layui.use('form', function(){
		var form = layui.form;
		//监听提交
		form.on('submit(Estimate)', function(data){
			var fileStatus = $.cookie('fileStatus')
			if(fileStatus == 0)
				layer.msg("Please upload a dataset.")
			if(fileStatus == 1)
				estimateConfirmPage()
			if(fileStatus == 2)
				layer.msg("The dataset is illegal. Please upload another one.")
			if(fileStatus == 3)
			{
				layer.confirm($.cookie('noticeMsg')+" Are you still want to continue?", 
					{
						btn: ['No','Continue'], //按钮
						title: 'Message'
					}, 
					function(index){
						layer.close(index);
					}, 
					function()
					{
						estimateConfirmPage()
					}
				);
			}
			function estimateConfirmPage() 
			{
				//dataType = data.field.dataType
				estMethod = data.field.simMethod
				modelName = data.field.modelName
				truncTime = data.field.truncTime
				totalSum = 1
				para_a = data.field.Parameter_a
				para_b = data.field.Parameter_b
				para_c = data.field.Parameter_c
				//iframe层-父子操作
				layer.open({
					title: 'Confirm',
					skin: 'layui-layer-molv',
					type: 2,
					area: ['650px', '600px'],
					fixed: true,
					maxmin: false,
					scrollbar: false,
					content: LimitControl.hostName() + 'welcome/confirm/estimationConfirm/'+truncTime+'/'+totalSum+'/'+estMethod+'/'+modelName+'/'+para_a+'/'+para_b+'/'+para_c
				});
			}
			return false;
		});
		//监听提交
		form.on('submit(Predict)', function(data){
			var fileStatus = $.cookie('fileStatus')
			if(fileStatus == 0)
				layer.msg("Please upload a dataset.")
			if(fileStatus == 1)
				predictionConfirmPage()
			if(fileStatus == 2)
				layer.msg("The dataset is illegal. Please upload another one.")
			if(fileStatus == 3)
			{
				layer.confirm($.cookie('noticeMsg')+" Are you still want to continue?", 
					{
						btn: ['No','Continue'], //按钮
						title: 'Message'
					}, 
					function(index){
						layer.close(index);
					}, 
					function()
					{
						predictionConfirmPage()
					}
				);
			}
			function predictionConfirmPage() 
			{
				//console.log(data.field)
				//return false

				var WSEtype = $.cookie('WSEtype')
				if(WSEtype == 1)
				{
					DataType = data.field.DataType
					dataTransform = data.field.EstimationMethod
					thresholdRule = data.field.thresholdRule2
					thresholdValue = data.field.thresholdMethod2
				}
				if(WSEtype == 0)
				{
					DataType = data.field.DataType
					dataTransform = data.field.dataTransform
					thresholdRule = data.field.thresholdRule
					thresholdValue = data.field.thresholdMethod
				}
				if(WSEtype == 1 || WSEtype == 0)
				{
					console.log('hello,world')
					fileName = $.cookie('fileName')
					realFileName = $.cookie($.cookie('fileName'))
					//iframe层-父子操作
					layer.open({
						title: 'Confirm',
						skin: 'layui-layer-molv',
						type: 2,
						area: ['650px', '600px'],
						fixed: true,
						maxmin: false,
						scrollbar: false,
						content: LimitControl.hostName() + 'welcome/confirm/predictionConfirm2/'+WSEtype+'/'+DataType+'/'+dataTransform+'/'+thresholdRule+'/'+thresholdValue+'/'+fileName+'/'+realFileName
					});
				}
			}
			return false;
		});
		form.on('radio(count)', function(data){
			console.log($.cookie('radioStatus'))
			oldRadioStatus = $.cookie('radioStatus')
			$.cookie('radioStatus',0)
			if(oldRadioStatus == 1 && $.cookie('fileStatus') != 0)
			{
				$.cookie('fileStatus',0)
				$("#fileName").html($.cookie('fileName')+'<i style="margin-left: 5px;" class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i>')
				var url = LimitControl.hostName() + 'Wavelet/check';
				var data_arr =
				{
					fileName : $.cookie($.cookie('fileName')),
					dataType : 'count'
				}
				function success_check1(jsonStr) 
				{
					data = jQuery.parseJSON(jsonStr);
					if(data.status == 'True')
					{
						$("#fileName").html($.cookie("fileName")+'<i style="margin-left: 5px;color: #5FB878;" class="layui-icon layui-icon-auz"></i>')
						layer.alert('Success: The total number of software fault is '+data.totalSum+' and the total term of dataset is '+data.totalTerm+'.',{btn: 'OK',title: 'Message'});
						$.cookie('fileStatus',1)
					}
					if(data.status == 'False')
					{
						$("#fileName").html($.cookie("fileName")+'<i style="margin-left: 5px;color: #FF5722;" class="layui-icon layui-icon-close-fill"></i>')
						//layer.msg(data.message)
						layer.alert('Fail: '+data.message,{btn: 'OK',title: 'Message'});
						$.cookie('fileStatus',2)
					}
					if(data.status == 'Notice')
					{
						$("#fileName").html($.cookie("fileName")+'<i style="margin-left: 5px;color: #FFB800;" class="layui-icon layui-icon-tips"></i>')
						//layer.msg(data.message)
						layer.alert('Notice: '+data.message,{btn: 'OK',title: 'Message'});
						$.cookie('fileStatus',3)
						$.cookie('noticeMsg',data.message)
					}
					//console.log(data.status);
				}
				function fail_check1(e) 
				{
					console.log(e.responseText);
				}
		    	LimitControl.sendAjax(url,data_arr,success_check1,fail_check1);

			}
		});

		form.on('radio(obserPoint2)', function(data){
			$("#obserPointMsg").html("Regard the first 20% of the whole data as early testing phase, and use the remaining 80% data for verification.");
		});
		form.on('radio(obserPoint5)', function(data){
			$("#obserPointMsg").html("Regard the first 50% of the whole data as middle testing phase, and use the remaining 50% data for verification.");
		});
		form.on('radio(obserPoint8)', function(data){
			$("#obserPointMsg").html("Regard the first 80% of the whole data as late testing phase, and use the remaining 20% data for verification.");
		});
		form.on('radio(obserPoint10)', function(data){
			$("#obserPointMsg").html("Use the 100% of the whole data for trainning.");
		});

		form.on('radio(Exp)', function(data){
			$("#Parameter_c_div").hide()
		});

		form.on('radio(NonExp)', function(data){
			$("#Parameter_c_div").show()
		});


		form.on('radio(cumulative)', function(data){
			console.log($.cookie('radioStatus'))
			oldRadioStatus = $.cookie('radioStatus')
			$.cookie('radioStatus',1)
			if(oldRadioStatus == 0 && $.cookie('fileStatus') != 0)
			{
				$.cookie('fileStatus',0)
				$("#fileName").html($.cookie('fileName')+'<i style="margin-left: 5px;" class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i>')
				var url = LimitControl.hostName() + 'Wavelet/check';
				var data_arr =
				{
					fileName : $.cookie($.cookie('fileName')),
					dataType : 'cumulative'
				}
				function success_check1(jsonStr) 
				{
					data = jQuery.parseJSON(jsonStr);
					if(data.status == 'True')
					{
						$("#fileName").html($.cookie("fileName")+'<i style="margin-left: 5px;color: #5FB878;" class="layui-icon layui-icon-auz"></i>')
						layer.alert('Success: The total number of software fault is '+data.totalSum+' and the total term of dataset is '+data.totalTerm+'.',{btn: 'OK',title: 'Message'});
						$.cookie('fileStatus',1)
					}
					if(data.status == 'False')
					{
						$("#fileName").html($.cookie("fileName")+'<i style="margin-left: 5px;color: #FF5722;" class="layui-icon layui-icon-close-fill"></i>')
						//layer.msg(data.message)
						layer.alert('Fail: '+data.message,{btn: 'OK',title: 'Message'});
						$.cookie('fileStatus',2)
					}
					if(data.status == 'Notice')
					{
						$("#fileName").html($.cookie("fileName")+'<i style="margin-left: 5px;color: #FFB800;" class="layui-icon layui-icon-tips"></i>')
						//layer.msg(data.message)
						layer.alert('Notice: '+data.message,{btn: 'OK',title: 'Message'});
						$.cookie('fileStatus',3)
						$.cookie('noticeMsg',data.message)
					}
					//console.log(data.status);
				}
				function fail_check1(e) 
				{
					console.log(e.responseText);
				}
		    	LimitControl.sendAjax(url,data_arr,success_check1,fail_check1);
			}
		});
	});

	layui.use('upload', function(){
	  var upload = layui.upload;
	   
	  //执行实例
	  var uploadInst = upload.render({
	    elem: '#upload' //绑定元素
	    ,exts:'xlsx'
	    ,auto: true //选择文件后自动上传
	    ,url: LimitControl.hostName() + 'Wavelet/upload' //上传接口
	    ,multiple: false
	    ,choose: function(obj){
	    		obj.preview(function(index, file, result){
	    			//old
	    			//$.cookie("fileName",file.name)
    				//$("#fileName").html(file.name+'<i style="margin-left: 5px;" class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i>')
	    			//new
	    			$.cookie("fileName",file.name.replace(/[^0-9a-zA-Z.]/g, ""))
	    			$("#fileName").html(file.name.replace(/[^0-9a-zA-Z.]/g, "")+'<i style="margin-left: 5px;" class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i>')
	    			
	    			//console.log(file.name)
	    		});
        }
        /*,data: {
			fileName : $.cookie("fileName")
		}*/
	    ,done: function(res){
	    	$.cookie($.cookie("fileName"),res.filename)
	    	//console.log($.cookie("fileName"));
	    	//console.log($.cookie($.cookie("fileName")));
	    	//var dataType = $("input[name='DataType']:checked").val()
	    	var isCumData = "cumulative"
	    	//var dataType = $("input[name='dataType']:checked").val()
	    	//console.log(dataType)
	    	var url = LimitControl.hostName() + 'Wavelet/check';
			var data_arr =
			{
				fileName : res.filename,
				dataType : isCumData
			}
			function success_check(jsonStr) 
			{
				data = jQuery.parseJSON(jsonStr);
				if(data.status == 'True')
				{
					$("#fileName").html($.cookie("fileName")+'<i style="margin-left: 5px;color: #5FB878;" class="layui-icon layui-icon-auz"></i>')
					//if dataType == "time"{}
					layer.alert('Success: This dataset has a total testing time of '+data.totalSum+' and contains '+data.totalTerm+' detected software faults.',{btn: 'OK',title: 'Message'});
					//if dataType == "group"{}
					$.cookie('fileStatus',1)
				}
				if(data.status == 'False')
				{
					$("#fileName").html($.cookie("fileName")+'<i style="margin-left: 5px;color: #FF5722;" class="layui-icon layui-icon-close-fill"></i>')
					//layer.msg(data.message)
					layer.alert('Fail: '+data.message,{btn: 'OK',title: 'Message'});
					$.cookie('fileStatus',2)
				}
				if(data.status == 'Notice')
				{
					$("#fileName").html($.cookie("fileName")+'<i style="margin-left: 5px;color: #FFB800;" class="layui-icon layui-icon-tips"></i>')
					//layer.msg(data.message)
					layer.alert('Notice: '+data.message,{btn: 'OK',title: 'Message'});
					$.cookie('fileStatus',3)
					$.cookie('noticeMsg',data.message)
				}
				//console.log(data.status);
			}
			function fail_check(e) 
			{
				console.log(e.responseText);
			}
	    	LimitControl.sendAjax(url,data_arr,success_check,fail_check);
	        //上传完毕回调
	        
	    }
	    ,error: function(){
	    	console.log("no");
	      //请求异常回调
	    }
	  });
	});


}

function destruct__index_tab()
{

}

index_tab()
