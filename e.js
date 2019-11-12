var wE = window.wangEditor;
function random_oss_filename(ret,file,ext) {
　　var len = 15;
　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';   
　　var maxPos = chars.length;
　　var pwd = ret.dir+'/';
　　for (i = 0; i < len; i++) {
    　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd+ext;
}

//{
	//e//编辑器
	//t//textarea
	//b//toolebar
	//o//上传前oss
	//u//上传server
//}
//oss返回
//var sign = ;
function sE(c){
	let content = c.e;
	let textarea  = c.t ;
	let toolbar = c.b;
	return function(){
		let we;
		if(typeof toolbar !== 'undefined'){
			 we = new wE(toolbar,content);
		}else{
			 we = new wE(content);
		}
		we.customConfig.uploadImgServer=c.u||1;
		we.customConfig.uploadImgMaxSize = c.i || 5242880;
		//上传处理
		we.customConfig.uploadImgHooks = {
				init: function ( editor,files) {
					// 图片上传之前触发
					// xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
					let f = files[0];
					let filename = f.name;
					let fileext = f.name.substr(f.name.lastIndexOf('.'));
					let filesize = f.size;
                                        $.ajaxSettings.async = false;
					$.get(c.o,{size:filesize},function(ret){
                                                $.ajaxSettings.async = true;
						let sign = typeof ret === 'object' ? ret.info : JSON.parse(ret).info;
						let object_name = random_oss_filename(sign,filename,fileext);
						 editor.config.uploadImgParams = {
							 OSSAccessKeyId:sign['accessid'],
							 policy:sign['policy'],
							 Signature:sign['signature'],
							 key:object_name,
                                                         file:f
						 }
						editor.config.uploadImgServer= sign['host'];
                                                editor.url = (sign['cdn'] || sign['host']) + "/" + object_name;
					});
					
					// 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
//					return {
//					    prevent: true,
//					    msg: '放弃上传'
//					}
				},
				success: function (xhr, editor, result) {
                                    editor.url = '';
				},
				fail: function (xhr, editor, result) {
					if(xhr.status == 200 ||xhr.status == 204 ){//204状态按正常处理
                                            editor.url = '';
                                        }
				},
				error: function (xhr, editor,ret) {
					alert('出错了');
				},
				timeout: function (xhr, editor) {
					alert('超时了');
				},

				customInsert: function (insertImg, result, editor) {
                                    editor.url && insertImg(editor.url);
				}
		};
		if(textarea !== undefined){
			$(textarea).change(function(){
				we.txt.html($(this).val());
			});
			we.customConfig.onchange = function (html) {
            // 监控变化，同步更新到 textarea
				$(textarea).val(html)
			}
		}
		we.create();
                if(textarea !== undefined){
                    $(textarea).change();
                }
	}()
}