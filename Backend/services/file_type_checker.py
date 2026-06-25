import magic


def check_file_type(file_path):

    return magic.from_file(

        file_path

    ) 