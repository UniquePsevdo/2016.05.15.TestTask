angular.module("testTaskApp", ["ngRoute", 'ngMaterial', 'appServices'])
    .constant("baseUrl", "https://infinite-depths-56882.herokuapp.com/")
    .controller("formCtrl", ['$scope', '$location', '$timeout', '$mdToast', 'apiService',  function ($scope, $location, $timeout, $mdToast, apiService) {
        $scope.sum = {value:""};
        $scope.term = {value:""};
        $scope.idNumber = {value:""};
        $scope.surname = {value:""};
        $scope.name = {value:""};
        $scope.subForm2IsValid = {value: false};
        $scope.city = {value: ""};

        /*send form data to the server*/
        $scope.sendData = function(){
            apiService.sendData({
                sum:        $scope.sum,
                term:       $scope.term,
                idNumber:   $scope.idNumber,
                surname:    $scope.surname,
                name:       $scope.name,
                city:       $scope.city
            }).then(function(res){
                console.log(res.data);
            });
        };

        /*calculating maximal allowed number of the days since 1900*/
        var year = new Date().getFullYear() - 21;
        var month = new Date().getMonth();
        var date = new Date().getDate();
        $scope.testDate = {value: "" + (Math.floor((new Date(year, month, date).getTime()/(3600*1000*24)) + 25568))};

        /*validating input fields and nested forms*/
        $scope.showValidation = function(field) {
            var isValid;
                var text = "";
                switch (field){
                    case "sum":
                        text = "Сумма – целочисленное значение от 1 до 10000, обязательное поле.";
                        isValid = $scope.subForm1.sum.$valid;
                        break;
                    case "term":
                        text = "Срок – целочисленное значение от 1 до 12, обязательное поле.";
                        isValid = $scope.subForm1.term.$valid;
                        break;
                    case "idNumber":
                        isValid = $scope.subForm2.idNumber.$valid;
                        $scope.subForm2IsValid.value = isValid;
                         if(parseInt(("" + $scope.idNumber.value).substring(0, 5)) > $scope.testDate.value){
                         isValid = false;
                         $scope.subForm2IsValid.value = false;
                         }

                        text = "ИНН - 10 цифр. Возраст должен быть старше 21 года, обязательное поле.";
                        break;
                    case "surname":
                        text = "Фамилия - обязательное поле.";
                        isValid = $scope.subForm2.surname.$valid;
                        break;
                    case "name":
                        text = "Имя - обязательное поле.";
                        isValid = $scope.subForm2.name.$valid;
                        break;
                    case "city":
                        text = "Город - обязательное поле.";
                        isValid = $scope.subForm2.city.$valid;
                }

            if(!isValid){
                $mdToast.show($mdToast.simple()
                    .textContent(text)
                    .position("top right"));
            }

        };

        /*getting tabs array for simulating clicks on elements of array*/
        $timeout(function(){
            $scope.tabs = ($('md-pagination-wrapper')[0]).children;
        },0);

        /*clicking on corresponding tab when url is changing*/
        $scope.$on("$locationChangeSuccess", function(event, newUrl){
            var arr = newUrl.split('https://infinite-depths-56882.herokuapp.com/:3000/#/');
            var pageNumber = arr[1];
            if(isValidPageNumber(pageNumber) && $scope.tabs){
                $timeout(function(){
                    $($($scope.tabs[pageNumber-1])[0]).trigger('click');
                }, 0);
            }
        });

        /*changing url after tabs clicking*/
        $scope.changeTab = function(index){
            $location.path(index);
        }

        /*validate manually inputed url*/
        function isValidPageNumber(str) {
            return /^[1-3]{1}$/.test(str);
        }

        /*watching for subform2 valid status relying on input fields requirements*/
        $scope.$watch('subForm2.$valid', function(newVal){
            if(typeof newVal !=='undefined' ){
                if(!newVal || !$scope.subForm2IsValid.value){
                    $timeout(function(){
                    $("#tab-content-1 > div > md-content > ng-form > div > button:nth-child(2)").attr('disabled', 'disabled');
                    $($('body > section > section > div > md-content > md-card > md-card-content > form > md-tabs > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:nth-child(3)')[0]).addClass('md-disabled');
                    },200);
                }else if(newVal && $scope.subForm2IsValid.value){
                    $timeout(function(){
                    $("#tab-content-1 > div > md-content > ng-form > div > button:nth-child(2)").removeAttr('disabled');
                    $($('body > section > section > div > md-content > md-card > md-card-content > form > md-tabs > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:nth-child(3)')[0]).removeClass('md-disabled');
                    },200);
                }
            }
        });

        /*watching for subform2 valid status relying on user's age estimation*/
        $scope.$watch('subForm2IsValid.value', function(newVal){
            if(typeof newVal !=='undefined' ){
                if(!newVal || !$scope.subForm2.$valid){
                    $timeout(function(){
                        $("#tab-content-1 > div > md-content > ng-form > div > button:nth-child(2)").attr('disabled', 'disabled');
                        $($('body > section > section > div > md-content > md-card > md-card-content > form > md-tabs > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:nth-child(3)')[0]).addClass('md-disabled');
                    },200);

                }else if(newVal && $scope.subForm2.$valid){
                    $timeout(function(){
                    $("#tab-content-1 > div > md-content > ng-form > div > button:nth-child(2)").removeAttr('disabled');
                        $($('body > section > section > div > md-content > md-card > md-card-content > form > md-tabs > md-tabs-wrapper > md-tabs-canvas > md-pagination-wrapper > md-tab-item:nth-child(3)')[0]).removeClass('md-disabled');
                    },200);
                }
            }
        });

        /*watching for the changes of idNumber field to set subform2 valid status*/
        $scope.$watch('idNumber.value', function(newVal){
             if(parseInt(("" + newVal).substring(0, 5)) > $scope.testDate.value){
             $scope.subForm2IsValid.value = false;
             }
        })

    }]);