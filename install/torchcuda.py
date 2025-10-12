import sys

str_get = sys.stdin.read()

if ", release " in str_get:
    main_version, sub_version = str_get.split(",")[1].split()[1].split(".")
else:
    main_version, sub_version = 0, 0

main_version = int(main_version)
sub_version = int(sub_version)


list_vesions = {
                7:  [5],
                8:  [0],
                9:  [0, 1, 2],
                10: [0, 1, 2],
                11: [0, 1, 3, 5, 6, 7, 8],
                12: [1, 4, 6, 8]
            }

extra_url = ""

if main_version in list_vesions:
    if len(list_vesions[main_version]) == 1:
        extra_url = f"https://download.pytorch.org/whl/cu{main_version}{list_vesions[main_version][0]}"
    else:
        try:
            index_ = list_vesions[main_version].index(sub_version)
            extra_url = f"https://download.pytorch.org/whl/cu{main_version}{list_vesions[main_version][index_]}"
        except:
            for sv_ in reversed(list_vesions[main_version]):
                if sub_version >= sv_:
                    extra_url = f"https://download.pytorch.org/whl/cu{main_version}{sv_}"
                    break

            if extra_url == "":
                extra_url = f"https://download.pytorch.org/whl/cu{main_version}{list_vesions[main_version][0]}"

if extra_url == "":
    extra_url = "https://download.pytorch.org/whl/cpu"

print(f"--extra-index-url {extra_url}")