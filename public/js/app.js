$(document).ready(function () {
    // $("#toHide").show();
    $("#toDoList").show();
    $("#completeList").show();
    
    // Get references to page elements
    var actName = $("#actName");
    var category = $("#Category");
    var Description = $("#actDescription");
    var submitBtn = $("#choose");
    var actList = $("#activityList");
    var btn = $(".buttonAct");





    // The API object contains methods for each kind of request we'll make
    var API = {
        saveActivity: function (activity) {
            return $.ajax({
                headers: {
                    "Content-Type": "application/json",
                },
                type: "POST",
                url: "api/activities",
                data: JSON.stringify(activity),
            });
        },
        getActivity: function () {
            return $.ajax({
                url: "api/activities",
                type: "GET",
            });
        },
        getActivityByCategory: function (categoryToShow) {
            return $.ajax({
                url: "api/activities/" + categoryToShow,
                type: "GET",
            });
        },
        deleteActivity: function (id) {
            return $.ajax({
                url: "api/activities/:" + id,
                type: "DELETE",
            });
        },
    };
    // refreshExamples gets new examples from the db and repopulates the list
    var refreshActivity = function (event) {
        event.preventDefault();

        $("#toHide").hide();


        API.getActivityByCategory(event.currentTarget.value).then(function (data) {

            actList.empty();
            for (var item of data) {
                var newElement = $("<div>")
                    .attr("class", "activityToDo")
                    .attr("data-name", item.act_name)
                var listedActName = $("<h4>").text(item.act_name);

                var listedActDesc = $("<p>").text(item.description)
                    .attr("value", item.description);

                let button = $("<button>")
                    .text("Choose Me")
                    .addClass("chooseMe")
                    .attr("data-id", item.id)
                    .attr("data-todo", item.todo);


                newElement.append(listedActName, listedActDesc, button);

                actList.append(newElement);
            }

        })



    };

    $(document).on("click", "#randomActivity", function (event) {
        event.preventDefault();
        actList.empty();

        var activity = $(this).parent();
        var id = $(this).data('id');
        var newTodo = true;
        var newTodoState = {
            todo: newTodo
        }

        $("#toHide").hide();

        API.getActivity(event).then(function (data) {

            for (var item of data) {

                console.log(data)
                
                var item = data[Math.floor(Math.random() * data.length)];


                var newElement = $("<div>")
                    .attr("class", "activityToDo")
                    .attr("data-name", item.act_name)
                var listedActName = $("<h4>").text(item.act_name);

                var listedActDesc = $("<p>").text(item.description)
                    .attr("value", item.description);

                let button = $("<button>")
                    .text("Choose Me")
                    .addClass("chooseMe")
                    .attr("data-id", item.id)
                    .attr("data-todo", item.todo);


                newElement.append(listedActName, listedActDesc, button);

                actList.append(newElement);
            }
        })

    })

    $(document).on('click', '.chooseMe', function (event) {
        event.preventDefault();

        $('#toDoList').empty();
        //allows user to update the name of any activity by clicking the 
        var activity = $(this).parent();
        var id = $(this).data('id');
        var newTodo = true;
        var newTodoState = {
            todo: newTodo
        }


        $.ajax(`/api/activities/${id}`, {
            type: 'POST',
            data: newTodoState
        }).then(function (activityUpdate) {
            console.log(activityUpdate)
            if (activityUpdate) {
                activity.remove();
                var newDiv = $('<div>')
                    .attr("class", "tile is-child box")
                var newActivity = $("<p>")
                    .attr("class", "title")
                    .text(activity.attr("data-name"))
                var actDescription = $('<p>').text(activity.val()).attr("class", "subtitle");
                var checkbox = $("<i>").attr("class", "fas fa-check-square").addClass('updateMe').attr('data-id', id).attr('data-complete', 0);
                // $(actDescription).append();
                $(newDiv).append(newActivity, actDescription, checkbox);
                $('#toDoList').append(newDiv);
            }

        })
    })

    $(document).on('click', '.updateMe', function (event) {
        event.preventDefault();

        $('#completeList').empty();
        //allows user to update the name of any activity by clicking the 
        var activity = $(this);
        var id = $(this).data('id');
        var newComplete = true;
        var newCompleteState = {
            completed: newComplete
        }


        $.ajax(`/api/activities/${id}`, {
            type: 'POST',
            data: newCompleteState
        }).then(function (activityUpdate) {
            console.log(activityUpdate)
            if (activityUpdate) {
                activity.remove();
                var newDiv = $('<div>')
                    .attr("class", "tile is-child box")
                var newActivity = $("<p>")
                    .attr("class", "title")
                    .text(activity.attr("data-name"))
                var actDescription = $('<p>').text(activity.val()).attr("class", "subtitle");
                var buttonDelete = $('<button>').text('Delete').addClass('deleteMe').attr('data-id', id);;
                $(newDiv).append(newActivity, actDescription, buttonDelete);
                $('#completeList').append(newDiv);
            }

        })
    })




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

})