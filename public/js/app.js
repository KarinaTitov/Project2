// Get references to page elements
var actName = $("#actName");
var category = $("#Category");
var Description = $("#actDescription");
var submitBtn = $("#choose");
var actList = $("#activityList");
var btn = $(".buttonAct");
var categoryToShow = btn.val();

var activityCategory = $("#activityCategory");
// The API object contains methods for each kind of request we'll make
var API = {
    saveActivity: function (activity) {
        return $.ajax({
            headers: {
                "Content-Type": "application/json"
            },
            type: "POST",
            url: "api/activities",
            data: JSON.stringify(activity)
        });
    },
    getActivity: function () {
        return $.ajax({
            url: "api/activities/",
            type: "GET"
        });
    },
    getActivityByCategory: function (categoryToShow) {

        return $.ajax({
            url: "api/activities/" + categoryToShow,
            type: "GET"
        });
    },
    deleteActivity: function (id) {
        return $.ajax({
            url: "api/activities/:" + id,
            type: "DELETE"
        });
    }
};
// refreshExamples gets new examples from the db and repopulates the list
var refreshActivity = function (event) {
    event.preventDefault();



    API.getActivityByCategory(event.currentTarget.value).then(function (data) {
        console.log(data);
        actList.empty();
        for (var item of data) {

            var newElement = $("<div>")
                .attr("class", "todoAct")


            var listedActName = $("<h4>")
                .text(item.act_name);

            var listedActDesc = $("<p>")
                .text(item.description);

            let button = $('<button>').text('Choose Me').addClass('chooseMe').attr('data-id', item.id).attr('data-todo', item.todo);

            newElement.append(listedActName, listedActDesc, button);

            actList.append(newElement);
        }

    })



};

$(document).on('click', '.chooseMe',  function () {
    //allows user to update the name of any burger by clicking the 
    var burger = $(this).parent();
    var id = $(this).data('id');
    var devour = {
        devoured: $(this).data('devour')
    };
    var name = $(this).prev().text();

    if (devour.devoured === false || devour.devoured === 0 || devour.devoured === '0') {
        $.ajax(`/api/burgers/${id}`, {
            type: 'PUT',
            data: devour
        }).then(function (burgerUpdate) {
            if (burgerUpdate) {
                burger.remove();
                var li = $('<li>');
                var p = $('<p>').text(name);
                var button = $('<button>').text('Destroy').addClass('updateMe').attr('data-id', id).attr('data-devour', 1);

                $(li).append(p, button);
                $('#toDelete').prepend(li);
            }

        })
    } else {
        $.ajax(`/api/burgers/${id}`, {
            type: 'DELETE'
        }).then(function (burgerDelete) {

            if (burgerDelete) {
                burger.remove();
            }

        })
    }
    location.reload();
})



// var activity = data.map(function (activity) {
//     var a = $("<h6>")
//         .text(activity.act_name)
//         .attr("href", "/activities/" + activity.category);
//     var p = $("<p>")
//     .text(activity.description)
//         .attr({
//             class: "list-group-item",
//             "data-id": activity.id
//         })
//         .append(a);
//     var button = $("<button>")
//         .addClass("btn btn-danger float-right doIt")
//         .text("+");
//     li.append(button);
//     return li;
// });

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function (event) {
    event.preventDefault();
    var activity = {
        act_name: actName.val().trim(),
        category: category.val().trim(),
        description: Description.val().trim(),

    };
    if (!(activity.category && activity.description)) {
        alert("You must enter an activity category and description!");
        return;
    }
    API.saveActivity(activity).then(function () {
        refreshActivity();
    });
    category.val("");
    Description.val("");
};
// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function () {
    var idToDelete = $(this)
        .parent()
        .attr("data-id");
    API.deleteActivity(idToDelete).then(function () {
        refreshActivity();
    });
};
// Add event listeners to the submit and delete buttons
submitBtn.on("click", handleFormSubmit);
actList.on("click", ".delete", handleDeleteBtnClick);
btn.on("click", refreshActivity);