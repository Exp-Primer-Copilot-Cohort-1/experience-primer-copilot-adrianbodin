function skillsMember() {
  return {
    restrict: 'E',
    templateUrl: 'templates/skills-member.html',
    scope: {
      member: '='
    },
    controller: function($scope, $element, $attrs) {
      $scope.member = $scope.member || {};
      $scope.member.skills = $scope.member.skills || [];
      $scope.member.skills.push({name: 'New Skill'});
    }
  };
} 