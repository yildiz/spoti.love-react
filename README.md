# spoti.love

spotify üzerinden sevdiğiniz kişiyle beraber aynı şarkıyı aynı anda dinleyebileceğiniz uygulamanın kullanıcı arayüzü.

## Kullanmak İçin Greksinimler

1-Spotify Preminum #spotify istiyor benlik değil

2-Bilgisayar #cep telefonu ve benzeri cihazlarda spotify wep player çalışmıyor

3-Sevgili #tek başıma test bile edemiyorum siz düşünün

## Neden geliştirildi

İnanıyorum ki aynı müziği dinleyen insanlar aynı duyduları paylaşır.

Beraber müzik dinlemeyi seven 2 kalbin uzak mesafelerde bu zevki yaşaması için geliştirildi.

## Neden Paylaşıldı

1-Kod okumak isteyenler için ideal olacağını düşündün. Değişken isimlerini Türkçe seçmeye çalıştım.

2- Görsel kısmı bok gibi oldu onu düzelterek pratik yapmak isteyen birine yardımcı olmak için.

3-Çok tatlı bir telefon uygulamsı olabilir. Geliştirmek isteyen olursa fikir eve alt yapı sağlamak için.

## Yükleme

```bash
npm install
```

Spotify Developer sayfasına gidin,
Developer Dashboard sekmesine tıklayıp giriş yapın,
Yeni proje oluşturun,
EDIT SETTINGS'e tıklayıp Redirect URIs kısmına

```bash
http://localhost:3000/
```

yazıp kaydedin.
Client ID'yi kopyalayıp Layout.jsx kısmında window.location yanında uygun yer ile değiştirin ve redirect_uri kınmını da düzeltin

```bash
npm start
```

şu an kendi back-end servisi yok bizimini kullanıyor değiştirmek için
RoomLogin.jsx dosyasına gidip componentDidMount içerisindeki io.connect içerisini değiştirebilirsiniz.

## Back-End

Haricidir. İçerisinde mevcut değildir. Bunun 2 sebebi vardı.

1- Harici back-end ile daha rahat çalışmam.

2- Gecekteki hobi projelerim için paralı bir server tutup hepsini onun üzeinden kontrol ederek tasaruf sağlamak.

Harici back-end'te sadece socket.io bağlantısı vardır. Tüm değişiklikler www dosyasının içerisindedir.

```bash
https://github.com/okanserbest/spotilove-backend
```

## Kullanılan Tenolojiler

React, Redux, Socket.io, Spotify wep player
