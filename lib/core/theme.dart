import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

ThemeData buildAppTheme() {
  return ThemeData(
    textTheme: GoogleFonts.getTextTheme(
      'Google Sans',
      ThemeData.light().textTheme,
    ),
  );
}
