package test

import (
	"reflect"
	"runtime/debug"
	"testing"
)

func AssertEqual(t *testing.T, value interface{}, expected interface{}) {
	if value != expected {
		debug.PrintStack()
		t.Errorf("Received %v (type %v), expected %v (type %v)", value, reflect.TypeOf(value), expected, reflect.TypeOf(expected))
	}
}
