var tgl = document.getElementById("in_tanggal");
var nama = document.getElementById("in_nama");
var lama = document.getElementById("in_lama_jam");
var jamke = document.getElementById("in_jamke");
var psw = document.getElementById("in_pass");
//mendapatkan tanggal
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if(dd<10) {
    dd = '0'+dd
} 

if(mm<10) {
    mm = '0'+mm
} 

today = dd + '-' + mm + '-' + yyyy;
// document.write(today);
//tanggal inputan
tgl.value = today;

ambil_data();

function book(){
	//getSelectedOption(lama);
	//document.write(lama.options[lama.selectedIndex].text);
	var pass = "pass";
	var pilih_jam = jamke.options[jamke.selectedIndex].text;
	var pilih_lama = lama.options[lama.selectedIndex].text;
	//pilih_jam = parseInt(pilih_jam) + 1;
	var array1 = pilih_lama.split(" ");
	
	//membuat password secara random
	var pass_jadi = Math.floor(Math.random() * 10);
	for(var a = 0; a < 5; a ++){
		pass_jadi =  pass_jadi.toString()  + Math.floor(Math.random() * 10);
	}
	
	
	// window.alert(pilih_jam);
	// window.alert(array1[0]);
	
	//cek bila sudah dipenuhi orang lain jadwalnya
	
	
	
		var referensi_mendengar =  firebase.database().ref().child("databooking").child(today);
		referensi_mendengar.once( 'value' ,function(datasnapshot){
		 
			pass = pass + pilih_jam;			 
			var angka_verif = 0;
			
			
			for (var i =1 ; i <= array1[0]; i++) 
			{
				var cek_pass = datasnapshot.child(pass).val();
				if(cek_pass == "0"){
					//window.alert("bisa");
					angka_verif+=1;
				}
				else{
					window.alert("Sepertinya pada jam tersebut sudah terisi oleh yang lain, Silahkan cari jam lain ! terima kasih :)");
					break;
					
				}
				pilih_jam = parseInt(pilih_jam) + 1;
				pass = "pass";
				pass = pass + pilih_jam;
			}
			// var lama_ke = document.getElementById("lama"+ array1[0]);
			// lama_ke.innerHTML = pilih_lama;
			var nama_pinjam = nama.value;
			var name = "nama";
			pilih_jam = jamke.options[jamke.selectedIndex].text;
			pass = "pass";
			pass = pass + pilih_jam;
			name = name + pilih_jam;
			if (angka_verif == array1[0]){
				for(var a = 1 ; a <= angka_verif; a++)
				{
					firebase.database().ref().child("databooking").child(today).child(pass).set(pass_jadi.toString());
					firebase.database().ref().child("databooking").child(today).child(name).set(nama_pinjam);
					var nama_tampil = document.getElementById(name);
					nama_tampil.innerHTML = nama_pinjam;
					pilih_jam = parseInt(pilih_jam) + 1;
					pass = "pass";
					pass = pass + pilih_jam;
					name = "nama";
					name = name + pilih_jam;
				}
				angka_verif = 0;
			}
			pilih_jam = jamke.options[jamke.selectedIndex].text;
			pass = "pass";
			pass = pass + pilih_jam;
			pass = "pass";
		});
		window.alert(pass_jadi +" Ini password kamu, tolong ingat baik baik dan silahkan screenshoot password kamu");
		
	}
	
	
function sub_tanggal(){
	today = tgl.value;
	
	// cek sabtu atau minggu
	var array5 = today.split("-"); 
	var bulan = parseInt(array5[1]);
    var today1 = bulan + "-" + array5[0] + "-" + array5[2];
	var d = new Date(today1);
	var n = d.getDay();
	window.alert(today + " " + n + " " );
	// cek apabila memasukan tanggal yang salah
	 if ((array5[0] <=0 || array5[0] > 31) || (array5[1] <=0 || array5[1] >12) || (array5[2] <2019 || array5[2] > 2030)){
		window.alert("Tanggal yang anda masukan  salah");
	 }		 
	 if(array5[0] > 28 && array5[2] % 4 != 0 && array5[1] == 2){
		 	window.alert("Tanggal yang anda masukan  salah");
	 }
	if ( n == 0 || n == 6 || n == NaN){
		window.alert("Tanggal yang anda pilih adalah hari libur");
	}
	if(n == "NaN"){
		window.alert("Tidak ada hari pada tanggal tersebut");
	}
	else if (n == 1 || n == 2 || n == 3 || n == 4 || n == 5 ){
		ambil_data();
	}
	
}


function ambil_data(){
	var angka = 7;
	var kondisi = "kondisi";
	var pass = "pass";
	var nama = "nama";
	var referensi_mendengar =  firebase.database().ref().child("databooking").child(today);
	referensi_mendengar.once( 'value' ,function(datasnapshot){
	 
	 
	 if(datasnapshot.exists()){
		 while (angka != 19){
			 
			var syarat1 = datasnapshot.child(angka).val();

			if(syarat1 == "0"){
				var id = document.getElementById(kondisi + angka);
				id.innerHTML = "belum digunakan";
			}
			else{
				var id = document.getElementById(kondisi + angka);
				id.innerHTML = "sedang digunakan";
				}
				
			var syarat2 = datasnapshot.child(nama + angka).val();

			if(syarat2 == "0"){
				var id = document.getElementById(nama + angka);
				id.innerHTML = "kosong";
			}
			else{
				var id = document.getElementById(nama + angka);
				id.innerHTML = syarat2;
				}
				angka =  angka + 1;
		 }
		 window.alert( ("Data Booking pada tanggal " + today));
	}
	else{
		while (angka != 19){
				firebase.database().ref().child("databooking").child(today).child(pass + angka).set("0");
				firebase.database().ref().child("databooking").child(today).child(angka).set("0");
				firebase.database().ref().child("databooking").child(today).child(nama + angka).set("0");
				
				var id = document.getElementById(kondisi + angka);
				id.innerHTML = "belum digunakan";
				angka =  angka + 1;
		 }
		ambil_data();
		window.alert( ("Data Booking pada tanggal " + today));
	}
	});
	
}


function aktivasi(){
	var waktu = new Date();
	var dd2 = waktu.getDate();
	var mm2 = waktu.getMonth()+1; //January is 0!
	var yyyy2 = waktu.getFullYear();
	var jam = waktu.getHours() - 7;

	if(dd2<10) {
		dd2 = '0'+dd2
	} 

	if(mm2<10) {
		mm2 = '0'+mm2
	} 

	waktu = dd2 + '-' + mm2 + '-' + yyyy2;
	// var waktu = new Date();
	
	
	window.alert(jam);
	window.alert(waktu);
	
	// window.alert(jam);
	if (jam < 6 || jam>18){
		window.alert("ups anda mengkonfirmasi saat ini pada waktu yang salah");
	}
	else{
		var referensi_mendengar =  firebase.database().ref().child("databooking").child(waktu);
		referensi_mendengar.once( 'value' ,function(datasnapshot){
			var cek =  datasnapshot.child("pass"+jam).val();
			if (psw.value == cek){
				window.alert("password benar");
				firebase.database().ref().child("databooking").child(waktu).child(jam).set("1");
				document.getElementById("kondisi" + jam).innerHTML = "sedang digunakan";
				for (var c = 1 ; c <= 2; c++){
					jam = jam + 1;
					var ceki =  datasnapshot.child("pass"+jam).val();
					if(psw.value == ceki){
						window.alert("password benar");
						var ganti_kon = document.getElementById("kondisi" + jam);
						ganti_kon.innerHTML = "Sedang digunakan";
						firebase.database().ref().child("databooking").child(waktu).child(jam).set("1");
					}
					// else{
						// window.alert("password salah");
					// }
				}
			}
			else{
				window.alert("password salah");
			}
			
		});
	}
}
function submitClick(){
	
	window.alert("eh");
	
}