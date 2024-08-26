class Logger:
    def print_main_log(msg):
        print('=' * 50)
        print('* [SYSTEM] ' + msg)
        print('=' * 50)
    
    def print_log(msg):
        print('* [SYSTEM] ' + msg)
    
    def print_error(msg):
        print('=' * 50)
        print('* [ERROR] ' + msg)
        print('=' * 50)