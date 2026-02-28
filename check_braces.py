
filename = r"c:\Users\hr\My VS code\sui-nigeria\src\app\globals.css"
try:
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    balance = 0
    for i, line in enumerate(lines):
        for char in line:
            if char == '{':
                balance += 1
            elif char == '}':
                balance -= 1
        
        if balance < 0:
            print(f"Error: Unexpected closing brace at line {i+1}")
            break
            
    if balance > 0:
        print(f"Error: Unclosed brace(s). Final balance: {balance}")
    elif balance == 0:
        print("Success: Braces are balanced.")

except Exception as e:
    print(f"Script error: {e}")
