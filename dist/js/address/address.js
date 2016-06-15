define(function(require, exports, module) {
	require('address/province.js');
	require('address/city.js');
	require('address/region.js');
	//require.async(['address/province.js', 'address/city.js','address/region.js']);
	/**
	* 获取当前地址
	* @param  region:地址编码
	*/
	var address ={
		getAddress : function(region){  
			var address = [];
			$.each(province_data, function(index,item){
				if((region.substring(0,2) + '0000') == index){
					address.push(item.name)
				}
			});
			$.each(city_data, function(index,item){
				if( (region.substring(0,4) + '00') == index){
					address.push(item.name)
				}
			});     
			$.each(region_data, function(index,item){
				if( region == index){
					address.push(item.name)
				}
			});
			return address.join('');
		},
		getProvince : function(){
			var i = 0,
			province = '<li data-id="000000" data-city="全国" class="selectCity">全国</li>';
			for(i in province_data){
				province += '<li data-id=' + i + '>' + province_data[i].name + '</li>';
			}; 
			$("#provinceList").append(province);
		}
	}
	module.exports = address
});