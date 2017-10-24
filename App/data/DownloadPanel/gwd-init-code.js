document.getElementById('page1_1').style = "display:none";
document.getElementById('opb').addEventListener('click', dot);
function dot (){
	document.getElementById('page1_1').style = "";
	document.querySelector('.dots').className +=" animate";
}