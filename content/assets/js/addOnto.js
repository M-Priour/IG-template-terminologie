$(document).ready(function(){



$("#Ahistoire").click(function(){
$('#idHistoire').html("");
    $.ajax({
    type: 'get',
    url: "https://smt.esante.gouv.fr/fhir/" + $('#typeValue').val() + "/" + $('#idValue').val() + "/_history?_summary=true",
    contentType: 'application/json',  
    dataType:"json",     
  })
    .done((data) => {

      if (data.entry != null) {   
        $.each(data.entry, function (i, obj) { 
        var content = '<tr>' ;
        content += '<td  >'+  obj.resource.meta.versionId +'</td><td  >' + obj.resource.version +'</td><td>' + obj.response.method  +'</td><td> ' + obj.response.status  + '</td><td> '+ obj.response.lastModified  +'</td>';
	content +='<table>';
	content +='<thead><tr> <td>Operation</td><td>Chemin</td><td>Nom</td><td>Précédent</td> <td>Valeur</td></tr></thead><tbody>';		
		    $.ajax({
		    type: 'get',
		    url: "https://smt.esante.gouv.fr/fhir/" + obj.id  +  "/$diff",
		    contentType: 'application/json',  
		    dataType:"json",     
		  })
		    .done((data) => {
		
		      if (data.entry != null) {   
		        $.each(data.parameter, function (i, obj) { 
		        content += '<tr>' ;
		        content += '<td>' + obj[0].valueCode +'</td><td>' + obj[1].valueString  +'</td><td> ' + obj[2].valueString + '</td><td> '+ obj[3].valueString   +'</td>';
		        
				
			content += '</tr>';
		        });
		     }   
		    });		
	content +='</tbody></table>';	
	content += '</tr>';
         $('#idHistoire').append(content);
        });
     }   
    })
    .fail((err) => {
      console.error(err);
    })
    .always(() => {
      });

    
});









	
	$('div.accord').each(function(indextable) { 
	    var id= $(this).find("div.accordion-body").attr("id");
	    $(this).find("H3.accordion-heading").append('<a class="accordion-toggle" data-toggle="collapse" href="#' + id  +'"><i class="gg-chevron-down"></i></a>');
	});


	
	$("#terminologit-search-content-valueset-cld").addClass("accordion-group");
	//$("#terminologit-search-content-valueset-cld").attr("id","logical-definition-accordion-group");
	var logicalDefHeading = $("#terminologit-search-content-valueset-cld").find("#logical-definition-cld");
	$(logicalDefHeading).addClass("accordion-heading");
	$(logicalDefHeading).append('<a class="accordion-toggle" data-toggle="collapse" href="#logical-definition-cld-collapse"><i class="gg-chevron-down"></i></a>');
	$(logicalDefHeading).next().addClass("accordion-body collapse");
	$(logicalDefHeading).next().attr('id', 'logical-definition-cld-collapse');

	$('.gg-chevron-down').each(function () {
		$(this).click(function () {
			jQuery(this).toggleClass("rotate-toggle");
		});
	});

	
     $(window).scroll(function () {
            if ($(this).scrollTop() > 50) {
                $('#back-to-top').fadeIn();
            } else {
                $('#back-to-top').fadeOut();
            }
        });
        // scroll body to 0px on click
        $('#back-to-top').click(function () {
            $('#back-to-top').tooltip('hide');
            $('body,html').animate({
                scrollTop: 0
            }, 800);
            return false;
        });

        $('#back-to-top').tooltip('show');

 var searchOnto ='<p><b>Recherche en live sur le SMT</b></p><div class=""> \
  Indiquer un mot clé  puis taper sur "enter" : \
   <input type="text" id="ontoSearch"  style="height:auto;font-size:12px" class="search form-control" form-control" placeholder="Recherche">  \
   <div class="language-plaintext highlighter-rouge"><div class="highlight"><pre class="highlight language-plaintext"><code class=" language-plaintext" id="requeteOnto">Requête sur le SMT</code></pre></div></div> \
   <span class="counter" id="counterOnto"></span> \
   <div id="resultOnto"></div> </div><hr/>';

 if($("p:contains('No Expansion for this valueset')").length > 0) {
  $(searchOnto).insertAfter($( "#expansion" ).siblings( "hr" ).eq(0));
 }else {
  $(searchOnto).insertBefore($( "#expansion" ).next( "div" ).children("div.table-responsive").eq(0));
 }

$('#ontoSearch').on( "change", function() {
  $('#resultOnto').html("Recherche ...");
  $('#counterOnto').html("");
  resultOnto      
  $.ajax({
    type: 'get',
    url: "https://smt.esante.gouv.fr/fhir//ValueSet/$expand?_format=json&url=" + ($('i:contains("Official URL")').next()).contents().eq(0).text() + "&filter=" + $('#ontoSearch').val(),
    contentType: 'application/json',  
    dataType:"json",     
  })
    .done((data) => {
      $('#resultOnto').html("");
      $('#counterOnto').html(data.expansion.total + ' item');
      if (data.expansion.contains != null) {   
        $('#resultOnto').html('<table  class="codes table table-bordered  table-striped"><thead><tr><th><b>Code</b></th><th><b>System</b></th><th><b>Display</b></th></tr></thead><tbody id="bodyOntoTable"></tbody></table>');
        $.each(data.expansion.contains, function (i, obj) { 
        var content = '<tr>' ;
        content += '<td  >' + obj.code +'</td><td  >' + obj.system+'</td><td  >' + obj.display+'</td>';
        content += '</tr>';
         $('#bodyOntoTable').append(content);
        });
     }   
    })
    .fail((err) => {
      console.error(err);
    })
    .always(() => {
      $('#requeteOnto').html("GET https://smt.esante.gouv.fr/fhir//ValueSet/$expand?_format=json&url=" + ($('i:contains("Official URL")').next()).contents().eq(0).text() + "&filter=" + $('#ontoSearch').val());
    });
});      



$('#orig').find('table.codes').each(function(indextable) { 
  if($(this).find("tr").length ==1) {
    $(this).parent().hide();
}
	$('<div class="form-group pull-right"> <input type="text"  style="height:auto;font-size:12px" class="search' + indextable +' form-control" placeholder="Recherche">  <span class="counter' + indextable + ' "></span></div>').insertBefore($(this));	
	firstTr = $(this).find('tr:first').remove()
	firstTr.find('td').contents().unwrap().wrap('<th>')
	$(this).prepend($('<thead></thead>').append(firstTr))
	$(this).addClass("results"+indextable); 
	  $(this).addClass("table-striped");

  $(".search"+indextable).keyup(function () {
    var searchTerm = $(".search"+indextable).val();
    var listItem = $('.results'+indextable +' tbody').children('tr');
    var searchSplit = searchTerm.replace(/ /g, "'):containsi('")
    
  $.extend($.expr[':'], {'containsi': function(elem, i, match, array){
        return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
    }
  });
    
  $(".results"+indextable +" tbody tr").not(":containsi('" + searchSplit + "')").each(function(e){
    $(this).attr('visible','false');
  });

  $(".results"+indextable +" tbody tr:containsi('" + searchSplit + "')").each(function(e){
    $(this).attr('visible','true');
  });

  if(searchSplit=="") {
    $(".results"+indextable +" tbody tr").attr('visible','true');
    $('.counter'+indextable).text("");
  }

  var jobCount = $('.results'+indextable +' tbody tr[visible="true"]').length;
    $('.counter'+indextable).text(jobCount + ' item');

  if(jobCount == '0') {$('.no-result').show();}
    else {$('.no-result').hide();}
		  });
	
});


if($("table.codes").find('tr:eq(0) th:eq(4)').text()=='dateFin')
	$("table.codes tr td:nth-child(5):not(:empty)").parent().children().css("background-color","#E69215");     
});
