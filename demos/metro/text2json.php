<?php

$filename = "input.txt";
$data =null;

//$data["filename"] = $filename;

$file = fopen($filename, "r") or exit("Unable to open file!");

$i = 2000;

while(!feof($file))
  {
		  $line = fgets($file);
			$line = str_replace("\n","", $line);
			
		  $vals = explode("\t",$line);
		  if ( count($vals) > 5){
		 // $uri = str_replace ( "\\","/", $vals[3]);
		 //$uri = str_replace ( "_a.jpg","", $uri);
		 
		 // ID	Artist	Start Time	End Time	Stage	Day
		 
		  s$data['items'][] = Array ( "id" => $vals[0], "artist" => $vals[1], "start" => $vals[2] , "end"=>$vals[3] , "stage"=>$vals[4], "day"=>$vals[5] );
			
			if ( $i-- < 0 )
				break;
			
  }

  }
fclose($file);

echo "var acts =" . json_encode($data) . ";";
?>
