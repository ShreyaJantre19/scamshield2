import oletools.olevba


def detect_macros(file_path):

    try:

        vbaparser = oletools.olevba.VBA_Parser(

            file_path

        )

        if vbaparser.detect_vba_macros():

            return True

        return False

    except:

        return False 