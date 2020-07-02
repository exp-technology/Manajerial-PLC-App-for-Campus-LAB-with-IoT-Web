#include <ESP8266WiFi.h>
#include <Keypad.h>
#include <LiquidCrystal_I2C.h>
#include <FirebaseArduino.h>
#include <time.h>
#include <PString.h>
//#include <Wire.h>

//untuk firebase
#define firebaseURl "manajerial-plc.firebaseio.com"
#define authCode "Op5eMOYoRLjYrTEKxbvD5pfLVYO3s7zm1Hfm2RFO"
//untuk keypad
#define pin1 D0
#define pin2 D9
#define pin3 D10
#define pin4 D3
#define pin5 D4
#define pin6 D5
#define pin7 D6
#define pin8 D7

const char* ssid = "BALA";
const char* password = "imayunci";
int timezone = 7 * 3600;
int dst = 0;

//untuk LCD
LiquidCrystal_I2C lcd(0x27,16,2);  // set the LCD address to 0x27 for a 16 chars and 2 line display
//untuk Keypad
const byte n_rows = 4;
const byte n_cols = 4;
 
char keys[n_rows][n_cols] = {
  {'1','2','3','A'},
  {'4','5','6','B'},
  {'7','8','9','C'},
  {'*','0','#','D'}
};
int huruf = 0, arrayke = 0 ,   sekali2 = 0 ;
unsigned long sekali = 0;
String hari_ini, angka, hari_ini_firebase , ke, jam_sekarang, menit_sekarang, kon_jam_sekarang, passwords, password_keypad, pass_sekarang;
String jam_booking[12];
unsigned int tunggu;
char buffer[40];
PString stri(buffer, sizeof(buffer));
 
byte colPins[n_rows] = {pin4,pin3,pin2,pin1};
byte rowPins[n_cols] = {pin8,pin7,pin6,pin5};
 
Keypad myKeypad = Keypad( makeKeymap(keys), rowPins, colPins, n_rows, n_cols); 
 
void setup()
{
  pinMode(D8, OUTPUT);
  digitalWrite(D8, LOW);
//  Serial.begin(115200);
  lcd.begin(16,2);
  lcd.init();                      // initialize the lcd 
  // Print a message to the LCD.
  lcd.backlight();
  lcd.clear();
  delay(2000);
  
  lcd.setCursor(1,0);
  lcd.print("Manajerial PLC");
  delay(1000);
  lcd.clear();

  
  Pengaturan_wifi();
  Pengaturan_data();      
  pengaturan_waktu();
}


void Pengaturan_wifi(){
//  Serial.println();
//  Serial.print("Wifi connecting");
//  Serial.print(ssid);

  WiFi.begin(ssid,password);

//  Serial.println();
//  Serial.print("Connecting");

  while (WiFi.status() != WL_CONNECTED){
    lcd.print("sdg konek wifi");
    delay(500);
    lcd.clear();
//    Serial.print(".");
  }
  
  delay(2000);
//  Serial.println(WiFi.localIP());
//  Serial.println("wif.iconnect");
}


void Pengaturan_data(){
  Firebase.begin(firebaseURl,authCode);
  delay(1000);
  float checking = Firebase.getFloat("check");
  while(checking != 1){
    lcd.print("sdg konek firebase");
    Firebase.begin(firebaseURl,authCode);
    float checking = Firebase.getFloat("check");
    delay(1000);
    lcd.clear();
  }
  
}

void pengaturan_waktu(){
  configTime(timezone, dst, "pool.ntp.org","time.nist.gov");
//  Serial.println("\nWaiting for Internet time");
  
  while(!time(nullptr)){
//     Serial.print("*");
     delay(1000);
  }
//  Serial.println("\nTime response....OK"); 
}

void loop()
{
      
      
      time_t now = time(nullptr);
      struct tm* p_tm = localtime(&now);
      
      while(sekali != 100  ){
        time_t now = time(nullptr);
        struct tm* p_tm = localtime(&now);
        sekali++;
 
        
        hari_ini = "databooking/";
        if(p_tm->tm_mday < 10){
           hari_ini = hari_ini + "0";
        }
        hari_ini = hari_ini + String (p_tm->tm_mday) ;
        hari_ini = hari_ini + "-";
        if(p_tm->tm_mon < 10){
           hari_ini = hari_ini + "0";
        }
        hari_ini = hari_ini  + String (p_tm->tm_mon + 1);
        hari_ini = hari_ini + "-" + String(p_tm->tm_year + 1900) ;
        jam_sekarang = String (p_tm->tm_hour);
        lcd.print("Hour now : " + jam_sekarang);
        lcd.setCursor(0,1);
        lcd.print(hari_ini);
        delay(100);
        lcd.clear();
        
        
        
        }
      
      while(tunggu != 1){
        tunggu++;
        hari_ini_firebase = hari_ini + "/" + jam_sekarang;
        kon_jam_sekarang = Firebase.getString(hari_ini_firebase);
//        lcd.print(jam_sekarang);
        if(kon_jam_sekarang == "1"){
          lcd.clear();
          delay(100);
          lcd.setCursor(0,0);
          lcd.print("Enjoy Practice");
        }
        else{
          lcd.setCursor(0,0);
          lcd.print("Masukan Password");
          lcd.setCursor(5,1);
          digitalWrite(D8, HIGH);
        }
      }

      
      jam_sekarang = String (p_tm->tm_hour);
      menit_sekarang = String (p_tm->tm_min);
      if (menit_sekarang == "0"){
        hari_ini_firebase =  hari_ini + "/"+jam_sekarang;
        kon_jam_sekarang = Firebase.getString(hari_ini_firebase);
        if(kon_jam_sekarang == "0"){
          lcd.setCursor(0,0);
          lcd.print("Masukan Password");
          lcd.setCursor(5,1);
          digitalWrite(D8, HIGH);
        }
      }
      

  char myKey = myKeypad.getKey();
 
  if (myKey != NULL && kon_jam_sekarang == "0"){
    huruf++;
    if (sekali2 == 0){
      lcd.clear();
      delay(100);
      lcd.setCursor(0,0);
      lcd.print("Masukan Password");
      lcd.setCursor(5,1);
      sekali2=1;
      
    }
    
    passwords = passwords + myKey;
    if(huruf == 6){
      pass_sekarang = hari_ini + "/pass" + jam_sekarang;
      lcd.clear();
      delay(100);
      lcd.setCursor(0,0);
      lcd.print("Masukan Password");
      lcd.setCursor(5,1);
      lcd.print(passwords);
      delay(1000);
      lcd.clear();
        if(passwords == Firebase.getString(pass_sekarang)){
          lcd.setCursor(0,0);
          lcd.print("Enjoy Practice");
          kon_jam_sekarang = "1";
          Firebase.setString( hari_ini_firebase,  kon_jam_sekarang);
          int jam_selanjutnyaI = jam_sekarang.toInt() + 1;
          String jam_selanjutnya = String (jam_selanjutnyaI);
          String jam_selanjutnya_firebase = hari_ini + "/pass" + jam_selanjutnya;
          if( Firebase.getString(jam_selanjutnya_firebase) == Firebase.getString(pass_sekarang)){
            Firebase.setString(hari_ini +"/"+ String (jam_sekarang.toInt()+1) , "1");
             jam_selanjutnyaI = jam_sekarang.toInt() + 2;
             jam_selanjutnya = String (jam_selanjutnyaI);
             jam_selanjutnya_firebase = hari_ini + "/pass" + jam_selanjutnya;
             if( Firebase.getString(jam_selanjutnya_firebase) == Firebase.getString(pass_sekarang)){
              Firebase.setString(hari_ini +"/"+ String (jam_sekarang.toInt()+2) , "1");
             }
          }
        digitalWrite(D8,LOW);
        }
        
        else{
        lcd.setCursor(0,0);
        lcd.print("Masukan Password");
        lcd.setCursor(5,1);
        passwords = "";
  //      lcd.print(myKey);
        huruf = 0;
        }
    }
    else{
      lcd.print(myKey);
    }
  }
}
