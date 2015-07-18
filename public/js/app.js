var app=angular.module("myApp", ['ui.bootstrap']);

app.controller('MainController', function($scope, $http, $modal, $log){

    $scope.formData={};

    $http.get('api/users')
        .success(function(data){
        $scope.users=data;

    })
        .error(function(data){
        console.log("Error: "+data);
    });




    $scope.createUser=function(){

        $http.post('api/users', $scope.formData)
            .success(function(data){
            for(var i in $scope.formData){
                $scope.formData[i]="";
            }
            $scope.formData={};
            $scope.users=data;

        })
            .error(function(data){
            console.log("Error: "+data);
        });



    };

    $scope.deleteUser=function(id){
        $http.delete('api/users/'+id)
            .success(function(data){

            $scope.users=data;


        })
            .error(function(data){
            console.log("Error: "+data);
        });
    };


    $scope.updateUser=function(id){

        $http.put('api/users/'+id, $scope.formData)
            .success(function(data){
            $scope.formData={};
            $scope.users=data;


        })
            .error(function(data){
            console.log("Error: "+data);
        });
    };



    $scope.animationsEnabled = true;

    $scope.open = function (user) {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'modal.html',
            controller: 'ModalInstanceCtrl',

            resolve: {
                items: function () {

                    return user;
                }
            }
        });

        modalInstance.result.then(function (user) {
            $scope.formData=user.data;

            if(user.flag){

                $scope.updateUser(user.data._id);
            }else{

                $scope.createUser();
                playTremolo();
            }
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };




});


app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {
    $scope.strings={};
    var update=items!==undefined;

    if(update){
        $scope.formData=items;
        $scope.strings={
            title: 'Editar usuario'

        };

    }else{
        $scope.strings={
            title: 'Añade un nuevo usuario'

        };
    }

    $scope.add = function () {

        $modalInstance.close({flag:update, data:$scope.formData});
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});


function playTremolo(){
    var audioContext = new AudioContext();

    // add effects here
    var tremolo=audioContext.createGain();
    tremolo.connect(audioContext.destination);
    tremolo.gain.value=0;
    var shaper=audioContext.createWaveShaper();
    shaper.curve=new Float32Array([0,1]);
    shaper.connect(tremolo.gain);


    var lfo=audioContext.createOscillator();
    lfo.type='sine';
    lfo.frequency.value=3;

    lfo.start(audioContext.currentTime);
    lfo.connect(shaper);


    // ^^^^^^^^^^^^^^^^^

    play(0, -9, 2.25);
    play(0, 3, 2.25);
    play(0, 0, 2.25);

    function play(delay, pitch, duration) {
        var time = audioContext.currentTime + delay;

        var oscillator = audioContext.createOscillator();

        oscillator.connect(tremolo);

        oscillator.type = 'triangle';
        oscillator.detune.value = pitch * 100 ;







        oscillator.start(time);
        oscillator.stop(time + duration);
    }

}

