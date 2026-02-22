trait ApiResponseTrait
{
public function success($data = null, $message = "Success")
{
return response()->json([
'status' => true,
'message' => $message,
'data' => $data
], 200);
}

public function error($message = "Error", $errors = [], $code = 400)
{
return response()->json([
'status' => false,
'message' => $message,
'errors' => $errors
], $code);
}
}