$(document).ready(function(){
  $.ajax({
    url: "http://localhost/SE/Ex%205%20-%20DevicesGraph2/data.php",
    method: "GET",
    success: function(data) {
      console.log(data);
      var device = [];
      var power = [];
      for(var i in data) {
        device.push("Device " + data[i].rDeviceDisplayName);
        power.push(data[i].rDevicePower);
      }
      var chartdata = {
        labels: device,
        datasets : [
          {
            label: 'DevicePower',
            backgroundColor: 'rgba(200, 200, 200, 0.75)',
            borderColor: 'rgba(200, 200, 200, 0.75)',
            hoverBackgroundColor: 'rgba(200, 200, 200, 1)',
            hoverBorderColor: 'rgba(200, 200, 200, 1)',
            data: power
          }
        ]
      };
      var ctx = $("#mycanvas");

      var barGraph = new Chart(ctx, {
        type: 'bar',
        data: chartdata
      });
    },
    error: function(data) {
      console.log(data);
    }
  });
});