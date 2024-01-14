

# def bad_exception():
#     try:
#         raise ValueError('Intentional - do not want this to get caught')
#         raise Exception('Exception to be handled')
#     except Exception as error:
#         print('Inside the except block: ' + repr(error))
        
# bad_exception()

class MyError(Exception):
    def __init__(self, message, animal):
        self.message = message
        self.animal = animal
    def __str__(self):
        return self.message


class MyException(Exception):
    def __init__(self, arg1, arg2=None):
        self.arg1 = arg1
        self.arg2 = arg2
        super(MyException, self).__init__(arg1)


class ValidationError(Exception):
    def __init__(self, message, errors):            
        # Call the base class constructor with the parameters it needs
        super().__init__(message)
            
        # Now for your custom code...
        self.errors = errors


class CustomError(Exception): 
    def __init__(self, value): 
        self.value = value
    def __str__(self): 
        return "Error: %s" % self.value



try:
    raise CustomError("something went wrong")
    
except CustomError as e:
    print(e)
# prints "Error: something went wrong"




# define Python user-defined exceptions
class Error(Exception):
    """Base class for other exceptions"""
    pass


class ValueTooSmallError(Error):
    """Raised when the input value is too small"""
    pass


class ValueTooLargeError(Error):
    """Raised when the input value is too large"""
    pass
