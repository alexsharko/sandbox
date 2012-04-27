<html>
  <head>
    <style type="text/css">
      html { background:#666; font-family:Sans-Serif; }
      body { padding:20px; margin:20px; background:white; min-height:200px; }

    </style>
    
  </head>
  <body>

	<form id="form2" class="discussion-commenting-form" method="post" action="form.php"> 
		<h2>Comment Form</h2>

		<input type="hidden" name="page_url" value=""> 
	
		<textarea id="comment-body" name="text"></textarea> 
		<p class="post-comment"><input type="submit" class="fancy-button" value="Post your comment" name="Post your comment"></p> 
		<p class="post-comment"><input type="button" class="fancy-button" value="Preview" name="preview-comment" id="previewBtn"></p> 

	</form>


    

<?php

function getParam2($key,$default)
{
	return (isset($_GET[$key])) ? $_GET[$key] : $default;
}

print('<pre>');
print_r($_POST);
print('</pre>');


?>



  </body>
</html>