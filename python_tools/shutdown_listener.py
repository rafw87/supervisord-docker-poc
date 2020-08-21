#!/usr/bin/env python3

import sys
import os
import json
from supervisor import childutils


def log(s=""):
    sys.stderr.write(s)
    sys.stderr.write("\n")
    sys.stderr.flush()


def main():
    rpc = childutils.getRPCInterface(os.environ)

    headers, payload = childutils.listener.wait(sys.stdin, sys.stdout)
    log(json.dumps(headers))
    log(json.dumps(payload))
    log()

    childutils.listener.ok(sys.stdout)
    rpc.supervisor.shutdown()


if __name__ == '__main__':
    main()
