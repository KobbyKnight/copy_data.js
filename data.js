jQuery(document).ready(function ($) {
"use strict";
// global var
let career_id = new Array;
const url = 'http://ec2-3-220-191-21.compute-1.amazonaws.com:8890/';
if (localStorage.getItem('token') !== null) {
    let details = JSON.parse(localStorage.uData);
    logout();
    //userData(details);
    news(details);
    events(details);
    notifications(details);
    careers(details);
    course(localStorage.getItem('token'));
    if (localStorage.getItem('cRs') !== null) {
		let courseDetails = JSON.parse(localStorage.cRs);
		coursePage(courseDetails);
    }
	contact_us(details);
	profile(details);
	refdata(localStorage.token);
	faq();
    // console.log(details);
}

//User Details function
function userData(data) {
  // $('.welcome').text('Welcome ' + data.profile.firstName);
  $('.kt-user-card__name').text(data.profile.firstName + ' ' + data.profile.lastName);
  $('.userInitial').text(data.profile.firstName.slice(0,1)+data.profile.lastName.slice(0,1));
}

// logout function
function logout() {
  $('.logout').on('click', function (e) {
	  e.preventDefault();
      let response = confirm('Are you you want to Logout?');
      if (response == true) {
		  $.ajax({
			  url: url+'api/logout/',
				type: 'POST',
			contentType: 'application/json',
				beforeSend: function(xhr) {
				  xhr.setRequestHeader('Authorization', localStorage.token);

				},
				success: function(xhr) {
				   window.location.href = '../login.html';
					localStorage.clear();
				},
				error: function(xhr){
					console.log('failed: '+xhr.status);
					alert('Failed to contact Api');
				  
				} 
		  });
       
      }
  });
}

// Notifications Alerts Function
function notifications(data){
  let alerts = data.notifications.alerts,a_link;
  $.each(alerts,function (i) {
    a_link=$('.alert_link:first').clone().insertAfter('.alert_link:last').find('.alert_msg').text(alerts[i].message);
  });

  if (a_link) {
    $('.alert_link:first').remove();
  }
}

// Notifications Events Function
function events(data) {
  let events = data.notifications.events, e_link;
  //Populates events under notifications
  $.each(events,function(i){
    e_link = $('.event_link:first').clone().insertAfter('.event_link:last').attr('href','event.html').find('.event_msg').text(events[i].message);
  });
  if (e_link) {
    $('.event_link:first').remove();
  }
  
  //Hanldes header event onclick
  
  $('#events').on('click',function(e){
	 e.preventDefault();
		$.ajax({
			url: url+'api/event/',
			type: 'GET',
			contentType: 'application/json',	
			beforeSend: function(xhr){
				xhr.setRequestHeader('Authorization',localStorage.token);
			},
			success: function(result) {
				sessionStorage.setItem('evts',JSON.stringify(result));
				window.location.href='event.html';
			  
			},
			error: function(xhr,result){
			  console.log('failed');
			  console.warn(xhr.status);
			}			
		});
  });
}
// Notifications News Function
function news(data) {
  let news = data.notifications.news, n_pane;
  $.each(news,function(i){
    n_pane = $('.news_link:first').clone().insertAfter('.news_link:last').attr('href','http://www.twitter.com').attr('target','_blank').find('.news_msg').text(news[i].message);

  });
  if (n_pane) {
    $('.news_link:first').remove();
  }
  
  //set the nofications count
  $('#notifCount').text(data.notifications.news.length + ' new');
}

// Career paths and Specializations
function careers(data){
  var careers = data.careers,menu,career_menu,career_item_list,current;
  var career,career_item = new Array;
  // Career ->DevOps , Full Stack ...etc
  $.each(careers,function(x){
    // console.log(careers[x].name);
 menu = $('.nested_menu:first').clone().insertAfter('.nested_menu:last').find('.nested_menu_name').text(careers[x].name);
      career = careers[x].specializations;
      // Career paths ->Code , Build, Deploy ...etc
      $.each(career,function(c){
        career_item =  career[c].courses;
        career_menu = $('.career_menu:first').clone().addClass('n').insertAfter('.career_menu:last').find('.career_menu_item').text(career[c].name);
          // Path Course -> Code>Java, C++ , Build> Mavin, Jerkyll
          $.each(career_item,function(ci){
            // console.log(career_item[ci]);
            career_item_list = $('.career_item:first').clone().addClass('new').insertAfter('.career_item:last').find('.course').prop('href',career_item[ci].id).find('.list').text(career_item[ci].name);
          });
      });
  });

  if(menu){
    $('.nested_menu:first').remove();
   }
   if(career_menu){
    $('.career_menu:not(.n)').remove();
   }
   if(career_item_list){
    $('.career_item:not(.new)').remove();
   }
}

// Function to handle each course selection
function course(token = null) {
  $('.course').on('click',function(e){
    e.preventDefault();
    var a = $(this).prop('href').slice(-1);
      jQuery.ajax({
        url: url+'api/career/course/'+a,
        type: 'GET',
        contentType: 'application/json',
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', token);

        },
        success: function(result) {
          localStorage.setItem('cRs',JSON.stringify(result));
          if (localStorage.getItem('cRs')) {
            window.location.href = 'clum.html';
          }
        },
        error: function(result){
          console.log('failed');
        }
      });
  });
}
//kt-menu__item--open-dropdown kt-menu__item--hover


/* -Function that sets the content of the course page in clum.html
   - It also handles setting the properties for accordion and topics	
*/
function coursePage(courseDetails) {
  // console.log(courseDetails);
  var a = courseDetails.title;
  var topics = courseDetails.topics;
  var allTopics;
  $('.courseName').text(courseDetails.name).append('<span class="kt-subheader-search__desc courseTitle ml-4 mr-4">'+ a +'</span>');
  $('.courseDesc').text(courseDetails.description);
  $.each(topics,function(i){
    // console.log(topics[i].id);
  allTopics =   $('.topic_main:first').clone().toggleClass("topic_main "+ 'topic_'+topics[i].id).attr('data-ktwizard-state','').attr('data-ktwizard-type','').insertAfter('.t:last').find('.topic').text(topics[i].name);
  })
	/*Cheks if clone was successful and removes original node.
	appends property of roiginal node to first child clone.
	Next for each clone on click reset video link and set content and dexcription */
  if (allTopics) {
	//remove original
	$('.topic_main:first').removeClass('t');
	//append theme property to first clone. this makes the right side of wizard show up on click.
	//May require further look, as it means user has to always click first clone node to load right side
	$('.topic_main:first').attr('data-ktwizard-state','current').attr('data-ktwizard-type','step');
	//handle each accordion topic click to alter video, content and description
       $('.t').each(function(a){
       $(this).on('click',function(e){
		 e.preventDefault();
		 $.ajax({
			url: url+'api/career/topic/'+topics[a].id,
			type: 'GET',
			data: topics[a].id,
			contentType: 'application/json',
			beforeSend: function(xhr){
				xhr.setRequestHeader('Authorization',localStorage.token);
			},
			success: function(res){
				 $('.topic_content').text(res.name).append("<span class='ml-auto pull-right form-text text-muted'>"+res.videoLength+"</span>");
				 $('.topic_desc').text(res.description?res.description:'This topic will be described here');
				//  $('#topic_length').text(res.videoLength);				
				 $('#topic_video').get(0).pause();
				 $('#topicVideo_src').attr('src',res.videoUrl);
				 $('#topic_video').get(0).load();
			},error:function(res){
				alert(res.responseJSON.message);
			}
		});
       });
	 });	
	}

}

/*
 * This handles all forms of contacts the user would like to make.
 * uses POST api/contact
 * corresponding contact links are handled using class -contact_link 
 * as well as content of contact page.
 * Contact page is a single dynamic webpage for all contacts
*/
function contact_us(data){
	var link_text;
	//get links
	$('.contact_link').each(function(a){		
		$(this).on('click',function(c){
			c.preventDefault();
			//get the innertext to use as type for api/contact
			link_text = $(this).closest('.contact_link').find('span').text();
			sessionStorage.setItem('contact_type',JSON.stringify(link_text));						
			if(link_text){
				window.location.href = 'contact.html';				
			}
		});
	});	
	//Populate known fields in form
	$('#full_name').val(data.profile.firstName + ' ' + data.profile.lastName?data.profile.firstName + ' ' + data.profile.lastName:'');
	$('#email').val(data.profile.email?data.profile.email:'');
}

/**
 * This contains Countries & cities listings
 * copied from intership.html
 * This solely pertains to profile page. can be further modified to handle all country and city input fields
 */
function refdata(token) {
	// GET COUNTRIES LIST
    $.ajax({
		url: url+'api/refdata/country/',
		type: 'get',
		dataType: 'json',
		success:function(response){

			var len = response.length;

			$("#p_country").empty();
			for( var i = 0; i<len; i++){
				var id = response[i]['id'];
				var name = response[i]['name'];
				var code = response[i]['code'];
				$("#p_country").append("<option value='"+code+"'>"+name+"</option>");

			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
		   alert(textStatus, errorThrown);
		},

		//headers: {'Authorization': 'Basic bWFkaHNvbWUxMjM='},
		beforeSend: function (xhr) {
		  xhr.setRequestHeader ("Authorization", token);
		},
});


// GET States BASED ON Country
$("#p_country").change(function(){
	var countryId = $('#p_country').val();
	console.log(countryId);
	

	$.ajax({
		url: url+'api/refdata/city',
		type: 'get',
		//data: {country_id:countryid},
		dataType: 'json',
		success:function(response){

			var len = response.length;

			$("#p_state").empty();
			for( var i = 0; i<len; i++){
				var id = response[i]['id'];
				var name = response[i]['stateId'];
				var stateId = response[i]['name'];
				
				//if(stateId == countryId){
					$("#p_state").append("<option value='"+id+"'>"+name+"</option>");
				//}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
		   alert(textStatus, errorThrown);
		},

		//headers: {'Authorization': 'Basic bWFkaHNvbWUxMjM='},
		beforeSend: function (xhr) {
		  xhr.setRequestHeader ("Authorization", token);
		},
	});
});
}

/**
 * Handles Profile page information
 * @param {localStorage.uData} data 
 */
function profile(data){
	//call user data
	userData(data);
	//Check if payment is enabled
	if(data.paymentAccepted == false){
		$('.payment').hide();
	}else{
		$('.payment').show();
	}
	

	//Account section
	$('#kt_subheader_total').text(data.profile.firstName + ' ' + data.profile.lastName);
	$('#p_fname').val(data.profile.firstName);
	$('#p_lname').val(data.profile.lastName);
	$('#p_phone').val(data.profile.phoneNumber?data.profile.phoneNumber:'');
	$('#p_email').val(data.profile.email?data.profile.email:'');
	$('#userType').val(data.profile.userType?data.profile.userType:'');
	var p = data.profile.avatarUrl?data.profile.avatarUrl:'';
	$('#p_avatarBackground').attr('src', p);

	$('#p_resume').text(data.profile.resumeUrl);
	$('#p_resume').on('change',function(){
		console.log($('#p_resume').val());
	});

	//Locations section
	/** Looks redundant anyway 
	*Ideas are welcome in this comment
	*setTimeout to ensure dom is fully loaded before population the locations
	*/
	setTimeout(() => {
		let i = $('.profLocations input');
	let a = new Array();
	$('.profLocations :input').each(function(i){
		a[i] = $(this).attr('id');		
	});
	console.log(data.profile.country);
	// console.log(a);	
	$.each(a,function(i){		
		// $('.profLocations :input')
		switch (a[i]){
			case 'p_postcode':
				$('#p_postcode').val(data.profile.postcode);
				break;
			case 'p_address1':
				$('#p_address1').val(data.profile.houseNumber);
				break;
			case 'p_address2':
				$('#p_address2').val(data.profile.street);
				break;
			case 'p_city':
				$('#p_city').val(data.profile.city);
				break;
			case 'p_state':
				$('#p_state').append("<option value="+data.profile.state+">"+data.profile.state+"</option>");
				$('#p_state').val(data.profile.state);
				break;
			case 'p_country':
				$('#p_country').val(data.profile.country);
				break;
			case 'p_zipcode':
				$('#p_zipcode').val(data.profile.zipCode);
				break;
			default:
				console.log(a[i]);
				break;
		}
	});
	}, 1000);
	//check login verification and reset verification values
	if (data.profile.enableLoginVerification == true) {
		$('#login_verify').toggleClass('custom');
		$('#login_verify').toggleClass('enabled');
	}
	if (data.profile.enablePasswordResetVerification == true) {
		$('#passwd_reset').prop('checked',true);
	}
	
	$('.nxtbtn').on('click',function(){
		console.log('clicked');
		//setup the details
		$('#accountSumm').text('').append($('#p_fname').val() + ' '+ $('#p_lname').val() + '<br>' +'Phone:' + $('#p_phone').val() + '<br/>' + 'Email:' + $('#p_email').val()+ '<br/>');
		
		$('#locationSumm').text('').append('House/Apt Number: '+ $('#p_address1').val()+'<br>' + 'Address: '+ $('#p_address2').val()+'<br>'+ 'ZipCode: '+ $('#p_zipcode').val()+'<br>' + 'City: '+ $('#p_city').val()+'<br>'+ 'State: '+ $('#p_state').val()+'<br>'+ 'Country: '+ $('#p_country').val()+'<br>')
	
	})
	
	//delete user
	$('.deactivate').on('click',function(e){
		let conf = confirm('This will delete your account. Please confirm your action');
		if(conf == true){
			$.ajax({
				url: url+'api/user/delete',
				type: 'DELETE',
				data: data.profile.email,
				beforeSend: function(xhr){
					xhr.setRequestHeader('Authorization',localStorage.token);
				},
				success: function(xhr){
					console.log(xhr.status);
				},error: function(xhr){
					alert(xhr.status);
				}
			});
		}
		
	});
}

/**
 * this method handles all content on FAQ page
 * the ajax calls for FAQ content on click of FAQ link
 * json response is stored in localstorage @faq and used to populate the view
 * last bit has is put in set interval to make sure DOM is fully loaded, 
 * then content/animations are applied.
 */
function faq(){
	$('.faq').on('click',function(e){
		e.preventDefault();
		console.log('faq');
		$.ajax({
			url: url+'api/faq/',
			type: 'GET',
			beforeSend: function(xhr){
				xhr.setRequestHeader('Authorization',localStorage.token);
			},
			success: function (result){
				window.location.href ="faq.html";
				localStorage.setItem('faq',JSON.stringify(result));			
			},
			error: function(xhr){
				alert(xhr.status);
			}
		});
		
	});
/**
 * populate @faq topics
 * If it works, Don't touch it
 */
	const faq = JSON.parse(localStorage.getItem('faq'));
	var c;
	setTimeout(() => {
		$.each(faq,function(i){				
			//	lists topics
			c = $('.f:first').clone().insertAfter('.f:last').find('.fl').attr('href','#'+faq[i].topic).find('.ft').text(faq[i].topic);
			
			//get each topic and its question and answers 
			let q = faq[i].faqs;
			$.each(q,function (f) {					
				$('.faq-accordion-c:first').clone().insertAfter('.faq-accordion-c:last')
				.addClass(faq[i].topic) //Class of element set to json value. used as ref to hide or show elements
				.find('.faq-accordion-h').attr('id',faq[i].topic).end()
				.find('.faq-accordion-ht').attr('data-target','#'+faq[i].topic+f).attr('aria-controls',faq[i].topic+f).text(q[f].question?faq[i].topic+': '+q[f].question:faq[i].topic+': '+'No Question')
				.end()
				.find('.faq-accordion-b').attr('id',faq[i].topic+f).attr('aria-labelledby',faq[i].topic)
				.end()
				.find('.card-body').text(q[f].answer?q[f].answer:'No answer')
				;
			});			
		});
		/**
		 * controls on click of each left hand item
		 * this maps to class assignment above 
		 * on childNode (:381) creation
		 */
		$('.fl').each(function(i){
		$(this).on('click',function(e){
			e.preventDefault();
			let a_item = $(this).attr('href').slice(1);
			if (a_item) {
				//find the item class to hide/show
				let a_sel = $('.accordion').find('.'+a_item);
				console.log(a_sel);
				if (a_sel) {
					a_sel.toggle(1000);
				}				
			}
		});
		})
	//remove original nodes
	if (c) {
		$('.f:first').remove();
		$('.faq-accordion-c:first').remove();
	}
	}, 1100);
}
});
