def send_email():
    try:
        mailServer =smtplib.SMTP("smtp.gmail.com")
    except Exception as e:
        print(e)
    
send_email()