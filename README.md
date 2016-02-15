# meter-register

Build docker container: sudo docker build -t meter-register .

Run it: sudo docker run -v /storage/shared/temp/meterdata/:/meterdata -p 5080:5080 meter-register

In background, with automatic restart
sudo docker run -d --restart unless-stopped -v /storage/shared/temp/meterdata/:/meterdata -p 5080:5080 meter-register